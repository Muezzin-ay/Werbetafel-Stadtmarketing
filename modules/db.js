
const { Sequelize, DataTypes, SequelizeDatabaseError } = require('sequelize');


const sequelize = new Sequelize('werbetafel_stadtmarketing', 'panelserver', 'polizei', {
    dialect: 'mariadb',
    dialectOptions: {}
})


module.exports = {

    authenticate: async function() {
        try {
            await sequelize.authenticate();
            console.log('Connection to database has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database, maybe it did not start properly.');
        };
    },
    
    Presentation: sequelize.define('Presentation', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ExpireDate: {
            type: DataTypes.DATE,
        },
        Name: {
            type: DataTypes.STRING,
            defaultValue: "Kampagne"
        },
        Creator: {
            type: DataTypes.STRING,
            defaultValue: "Unbekannt"
        },
        Sequence: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }),
    
    
    Slide: sequelize.define('Slide', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        PFk: {
            type: DataTypes.INTEGER
        },
        Sequence: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }),

    
    Setting: sequelize.define('Setting',  {
        AutoSlideDuration: {
            type: DataTypes.INTEGER,
            defaultValue: 10000 //10 seconds
        },
        TelegramSecret: {
            type: DataTypes.STRING
        }
    }),
    
    // Do not execute this!
    initDatabase: async function() {
        try {
            await this.Presentation.sync({force: true});
            await this.Slide.sync({force: true});
            await this.Setting.sync({force: true});

            await this.Setting.create({}); //Standart Settings
            
        } catch(e) {
            console.log(e);
        }
        
    },

    readTelegramSecret: async function(underFunc) {
        let settings = await this.Setting.findOne({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } })
        let token = settings.dataValues.TelegramSecret
        underFunc(token)
    },
    
    createPresentation: async function(files, presentationInfo, feedbackHandler, io, moveSlide) {        
        try {
            const pre = await this.Presentation.create({ ExpireDate: '2023-05-12 12:00:00', Name: presentationInfo.name, Creator: presentationInfo.company });
            await pre.update({ Sequence: pre.dataValues.ID }) //Set own ID as standart Sequence Position

            // Setting a default value based on the pre's ID if there was no input from the user
            if (pre.dataValues.Name == 'Kampagne') { // Kampagne is already a standart value, set by sequelize
                let newName = "Kampagne-" + pre.dataValues.ID;
                await pre.update({ Name: newName })
            }


            let slideCount = files.length;

            for (let i=0; i<slideCount; i++) {
                let slide = await this.Slide.create({ PFk: pre.dataValues.ID, Sequence: i});
                moveSlide(files[i], slide.dataValues.ID, pre.dataValues.ID);
            }
            feedbackHandler.update(3);
            io.emit("reloadPage", ''); //Send reload command to all active clients
            feedbackHandler.end();
        } catch(e) {
            console.log(e);
        }
    },

    createSlide: async function(presentationFK, sequence) {
        try {
            await this.Slide.create({ PFk: presentationFK, Sequence: sequence});
        } catch(e) {
            console.log(e);
        }
    },

    readFirstSlide: async function(res) {
        const presentations = await this.Presentation.findAll({ order:[ ['Sequence', 'ASC'] ] });

        let data = [];
        for (let i=0; i<presentations.length; i++) {
            prJsonItem = {}
            let slides = await this.Slide.findAll({ where: { PFk: presentations[i].dataValues.ID}, order:[ ['Sequence', 'ASC'] ]});
            prJsonItem.slides = [];
            for (let slide of slides) {
                prJsonItem.slides.push({ ID: slide.dataValues.ID, PFk: slide.dataValues.PFk })
            };
            prJsonItem.presentation = presentations[i];
            data.push(prJsonItem);
        }
        res.send(JSON.stringify(data));
    },

    readAllSlides: async function(res) {
        const presentations = await this.Presentation.findAll({ where: { Visible: true }, order:[ ['Sequence', 'ASC'] ] });

        let data = [];
        for (let i=0; i<presentations.length; i++) {
            let slidesItem = [];
            let slides = await this.Slide.findAll({ where: { PFk: presentations[i].dataValues.ID }, order:[ ['Sequence', 'ASC'] ]});
            for (let slide of slides) {
                slidesItem.push({ ID: slide.dataValues.ID, PFk: slide.dataValues.PFk })
            };
            data.push(slidesItem);
        }
        res.send(JSON.stringify(data));
    },

    changeSlideSequence: async function(slideSequence, io, res) {
        for (slide of slideSequence.slides) {
            let slideEntry = await this.Slide.findOne({ where: { ID: slide.id } });
            await slideEntry.update({ Sequence: slide.position })
        };
        io.emit("reloadPage", ''); //Send reload command to all active clients
        res.status(200).send('good');
    },

    setPresentationVisibility: async function(data, io, res) {
        try {
            const presentation = await this.Presentation.findOne({ where: { ID: data.presentationID} });
            await presentation.update({ Visible: data.isVisibile });
            io.emit('reloadPage', '');
            res.status(200).send('good');
        } catch(err) {
            res.status(500).send('Server is occured.');
        }
    },

    deletePresentation: async function(data, io, res, deleteImageFile) {
        try {
            
            let slides = await this.Slide.findAll({ where: { PFk: data.presentationID } });
            for (let slide of slides) {
                deleteImageFile(slide, res);
            }
            await this.Slide.destroy({ where: { PFk: data.presentationID } });
            await this.Presentation.destroy({ where: { ID: data.presentationID } });
            io.emit("reloadPage", ''); //Send reload command to all active clients
            res.status(200).send('good');
        } catch(err) {
            res.status(500).send('Server is occured.');
        };
    },

    readSettings: async function(res) {
        let settings = await this.Setting.findOne({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } }); //Only one entry
        res.send(JSON.stringify(settings));
    }, 

    writeSettings: async function(data, io, res) {
        let settings = await this.Setting.findOne(); //Only one entry
        try {
            await settings.update(data);
            io.emit("reloadPage", ''); //Send reload command to all active clients
            res.status(200).send('good');
        } catch(err) {
            if (err === SequelizeDatabaseError) {
                res.status(406).send('Error: Invalid Datatype')
            } else {
                console.log('Unexpected Error: ' + err);
                res.status(500).send('Server is occured.')
            }
        };
    },

    swapPresentationSequence: async function(data, io, res) {
        try {
            for (let i=0; i < data.length; i++) {
                let preId = i+1;
                let presentation = await this.Presentation.findOne({ where: { ID: data[i] } });
                await presentation.update({ Sequence: preId })
            };
            io.emit("reloadPage", ''); //Send reload command to all active clients
            res.status(200).send('good');
        } catch(err) {
            console.log('Unexpected Error: ' + err);
            res.status(500).send('Server is occured.');
        }
    }
}
