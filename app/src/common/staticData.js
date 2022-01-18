export const TEAM_ICON_DEFAULT = "https://s3.amazonaws.com/s4usitesimages/images/JustSmallLogo.png";
export const PLAYER_ICON_DEFAULT = "https://s3.amazonaws.com/s4usitesimages/images/anon-avatar.png";

export const DEMO = {
    Shot: {
        success: ["On Target", "Goal"],
        cols: ["On Target", "Off Target"]
    },
    Pass: {
        success: ["Successful"],
        cols: ["Successful", "Unsuccessful"]
    },
    Cross: {
        success: ["Successful"],
        cols: ["Successful", "Unsuccessful"]
    },
    Dribble: {
        success: ["Successful"],
        cols: ["Successful", "Unsuccessful"]
    },
    Foul: {
        success: ["Free Kick"],
        cols: ["Successful", "Unsuccessful"]
    }
}
export const ACTION_DEMO = {
    Shot: {
        type: [
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
            { id: 3, name: "Header" },
            { id: 11, name: "Free Kick" },
            { id: 13, name: "Penalty" },
        ],
        success: ["On Target", "Goal"],
        calc: [
            { title: "On Target", values: [] },
            { title: "Off Target", values: [] }
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
        success: ["Successful"],
        calc: [
            { title: "Successful", values: [] },
            { title: "Unsuccessful", values: [] }
        ]
    },
    Cross: {
        type: [
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
            { id: 11, name: "Free Kick" },
            { id: 12, name: "Corner" },
        ],
        success: ["Successful"],
        calc: [
            { title: "Successful", values: [] },
            { title: "Unsuccessful", values: [] }
        ]
    },
    Dribble: {
        type: [
            { id: 1, name: "Right" },
            { id: 2, name: "Left" },
        ],
        success: ["Successful"],
        calc: [
            { title: "Successful", values: [] },
            { title: "Unsuccessful", values: [] }
        ]
    },
    Foul: {
        type: [
            { id: 8, name: "Regular" },
            { id: 9, name: "Yellow Card" },
            { id: 10, name: "Red Card" },
        ],
        success: ["Free Kick"],
        calc: [
            { title: "Successful", values: [], },
            { title: "Unsuccessful", values: [] }
        ]
    }
}