const PlayerTags = {
    areas: [
        { id: 1, name: "Defensive" },
        { id: 2, name: "Defensive Middle" },
        { id: 3, name: "Offensive Middle" },
        { id: 4, name: "Offensive" },
    ],

    ACTIONS: [
        { id: 12, value: 'Short Pass' },
        { id: 2, value: 'Pass' },
        { id: 1, value: 'Shot' },
        { id: 3, value: 'Cross' },
        { id: 4, value: 'Dribble' },
        { id: 5, value: 'Foul' }
    ],

    pass: {
        type: [
            { id: 5, name: 'Long Pass ' },
            { id: 6, name: 'Through Pass' },
            { id: 7, name: 'Key Pass' },
            { id: 4, name: 'Short Pass' },
            { id: 14, name: 'Throw In' },
            { id: 11, name: 'Free Kick' },
            { id: 15, name: 'Pass For A Shot' },
            { id: 12, name: 'Corner' },
            { id: 16, name: 'Diagonal' }
        ],

        result: [
            { id: 4, name: 'Successful' },
            { id: 5, name: 'Stole' },
            { id: 7, name: 'Blocked' },
            { id: 11, name: 'Bad Pass' },
            { id: 15, name: 'Offside' },
            { id: 9, name: 'Assist' },
            { id: 19, name: 'Deflected' },
            { id: 18, name: 'Air Challenge' },
            { id: 8, name: 'Ground Challenge' }
        ]
    },



    short: {
        type: [
            { id: 1, name: 'Right' },
            { id: 2, name: 'Left' },
            { id: 3, name: 'Header' },
            { id: 11, name: 'Free Kick' },
            { id: 13, name: 'Penalty' }
        ],

        result: [
            { id: 6, name: 'Saved' },
            { id: 17, name: 'Super Saved' },
            { id: 7, name: 'Blocked' }
        ]
    },

    cross: {
        type: [
            { id: 1, name: 'Right' },
            { id: 2, name: 'Left' },
            { id: 11, name: 'Free Kick' },
            { id: 12, name: 'Corner' }
        ],

        result: [
            { id: 4, name: 'Successful' },
            { id: 10, name: 'Unsuccessful' },
            { id: 7, name: 'Blocked' },
            { id: 8, name: 'Cleared' },
            { id: 15, name: 'Offside' },
            { id: 18, name: 'Air Challenge' }
        ]
    },

    dribble: {
        type: [
            { id: 1, name: 'Right' },
            { id: 2, name: 'Left' }
        ],

        result: [
            { id: 4, name: 'Successful' },
            { id: 10, name: 'Unsuccessful' },
            { id: 16, name: 'Draw Foul' },
            { id: 17, name: 'Stolen' },
            { id: 15, name: 'Deflected' },
            { id: 19, name: 'Ground Challenge' }
        ]
    },

    foul: {
        type: [
            { id: 8, name: "Regular" },
            { id: 9, name: "Yellow Card" },
            { id: 10, name: "Red Card" }
        ],

        result: [
            { id: 13, name: "Free Kick" },
            { id: 14, name: "Penalty" },
        ]
    }

}

export default PlayerTags