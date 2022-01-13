export const actions = {
    Shot: {
        type: [
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
            { id: 3, name: "Header" },
            { id: 11, name: "Free Kick" },
            { id: 13, name: "Penalty" },
        ],
        result: [
            { id: 1, name: "On Target" },
            { id: 2, name: "Off Target" },
        ],
        calc: [
            { title: "On Target", count: 0 },
            { title: "Off Target", count: 0 }
        ]
    },
    Pass: {
        type: [
            { id: 5, name: "Long Pass" },
            { id: 6, name: "Through Pass" },
            { id: 7, name: "Key Pass" },
            { id: 4, name: "Short Pass" },
            { id: 14, name: "Throw-In" },
            { id: 11, name: "Free Kick" },
        ],
        result: [
            { id: 4, name: "Successful" },
            { id: 17, name: "Stolen By" },
            { id: 11, name: "Bad Pass" },
            { id: 15, name: "Offside" },
        ],
        calc: [
            { title: "Successful", count: 0 },
            { title: "Unsuccessful", count: 0 }
        ]
    },
    Cross: {
        type: [
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
            { id: 11, name: "Free Kick" },
            { id: 12, name: "Corner" },
        ],
        result: [
            { id: 4, name: "Successful" },
            { id: 7, name: "Blocked" },
            { id: 8, name: "Cleared" },
            { id: 15, name: "Offside" },
        ],
        calc: [
            { title: "Successful", count: 0 },
            { title: "Unsuccessful", count: 0 }
        ]
    },
    Dribble: {
        type: [
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
        ],
        result: [
            { id: 4, name: "Successful" },
            { id: 10, name: "Unsuccessful" },
            { id: 16, name: "Draw Foul" },
            { id: 17, name: "Stolen By" },
        ],
        calc: [
            { title: "Successful", count: 0 },
            { title: "Unsuccessful", count: 0 }
        ]
    },
    Foul: {
        type: [
            { id: 8, name: "Regular" },
            { id: 9, name: "Yellow Card" },
            { id: 10, name: "Red Card" },
        ],
        result: [
            { id: 13, name: "Free Kick" },
            { id: 14, name: "Penalty" }
        ],
        calc: [
            { title: "Successful", count: 0 },
            { title: "Unsuccessful", count: 0 }
        ]
    }
}