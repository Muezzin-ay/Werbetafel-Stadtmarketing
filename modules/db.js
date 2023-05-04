
const { Sequelize, DataTypes } = require('sequelize');



const sequelize = new Sequelize('werbetafel_stadtmarketing', 'panelserver', 'polizei', {
    dialect: 'mariadb',
    dialectOptions: {}
})


module.exports = {

    authenticate: async function() {
        await sequelize.authenticate();
    },
    
    testConnection: async function() {
        try {
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
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
            type: DataTypes.STRING
        },
        Creator: {
            type: DataTypes.STRING
        },
        Sequence: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
            type: DataTypes.INTEGER
        }
    }),
    
    // Do not execute this!
    initDatabase: async function() {
        try {
            await this.Presentation.sync({force: true});
            await this.Slide.sync({force: true});
            await this.Setting.sync({force: true});

            await this.Setting.create({ //Standart Settings
                AutoSlideDuration: 10000 //10 seconds
            });
            
        } catch(e) {
            console.log(e);
        }
        
    },
    
    
    createPresentation: async function(files, moveSlide) {        
        try {
            const pre = await this.Presentation.create({ ExpireDate: '2023-05-12 12:00:00', Name: "Campagne-1", Creator: "Robin H." });
            await pre.update({Sequence: pre.dataValues.ID}) //Set own ID as standart Sequence Position
            let slideCount = files.length;

            for (let i=0; i<slideCount; i++) {
                let slide = await this.Slide.create({ PFk: pre.dataValues.ID, Sequence: i});
                moveSlide(files[i], slide.dataValues.ID, pre.dataValues.ID);
            }
        } catch(e) {
            console.log(e);
        }
    },

    readPresentations: async function(res) {
        const presentations = await this.Presentation.findAll();
        let data = [];
        for (let i=0; i<presentations.length; i++) {
            prJsonItem = {}
            let firstSlide = await this.Slide.findOne({ where: { PFk: presentations[i].dataValues.ID, Sequence: 0}});
            prJsonItem.slide = firstSlide;
            prJsonItem.presentation = presentations[i];
            data.push(prJsonItem);
        }
        res.send(JSON.stringify(data));
    },

    createSlide: async function(presentationFK, sequence) {
        try {
            await this.Slide.create({ PFk: presentationFK, Sequence: sequence});
        } catch(e) {
            console.log(e);
        }
    },

    getSlides: async function(res) {
        const slides = await this.Slide.findAll();
        res.send(JSON.stringify(slides))
    },

    deleteSlide: async function(slideId, res) {
        await this.Slide.destroy({ where: { id: slideId } });
        res.send('good');
    },

    getSettings: async function(res) {
        let settings = await this.Setting.findAll()[1]; //Only one entry
        res.send(JSON.stringify(settings));
    }
}
