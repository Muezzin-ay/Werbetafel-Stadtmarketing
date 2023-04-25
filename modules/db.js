
const { Sequelize, DataTypes } = require('sequelize');



const sequelize = new Sequelize('testing', 'root', 'feuerwehr', {
    dialect: 'mariadb',
    dialectOptions: {
    // Your mysql2 options here
    }
})


module.exports = {

    authenticate: async function() {
        await sequelize.authenticate();
    },
    
    testCon: async function() {
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
    
    // Do not execute this!
    initDatabase: async function() {
        try {
            await this.Presentation.sync({force: true});
            await this.Slide.sync({force: true});
        } catch(e) {
            console.log(e);
        }
        
    },
    
    
    createPresentation: async function(res) {        
        try {
            const pre = await this.Presentation.create({ ExpireDate: '2023-05-12 12:00:00', Name: "Campagne-1", Creator: "Robin H."});
            await pre.update({Sequence: pre.dataValues.ID}) //Set own ID as standart Sequence Position

            for (let i=0; i<2; i++) {
                this.createSlide(pre.dataValues.ID, i);
            }
        } catch(e) {
            console.log(e);
        }
        res.send("good");
    },

    readPresentations: async function(res) {
        const presentations = await this.Presentation.findAll();
        let data = [];
        for (let i=0; i<presentations.length; i++) {
            let firstSlide = await this.Slide.findOne({ where: { PFk: presentations[i].dataValues.ID, Sequence: 0}});
            data.push(firstSlide);
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

    getPresentationSequence: async function(res) {
        
    }
}
