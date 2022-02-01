export const TEAM_ICON_DEFAULT = "https://s3.amazonaws.com/s4usitesimages/images/JustSmallLogo.png";
export const PLAYER_ICON_DEFAULT = "https://s3.amazonaws.com/s4usitesimages/images/anon-avatar.png";

export const RULE = [
    {
        title: "Shot",
        successful: [1, 3],
        unsuccessful: [2],
        row: [
            { action_id: 1, action_type_id: [1], title: "Right" },
            { action_id: 1, action_type_id: [2], title: "Left" },
            { action_id: 1, action_type_id: [3], title: "Header" },
            { action_id: 1, action_type_id: [11], title: "Free-Kick" },
            { action_id: 1, action_type_id: [13], title: "Penalty" }
        ]
    },
    {
        title: "Pass",
        successful: [4],
        unsuccessful: [11, 15],
        row: [
            { action_id: 2, action_type_id: [7], title: "Key Pass" },
            { action_id: 2, action_type_id: [6], title: "Through Pass" },
            { action_id: 2, action_type_id: [5], title: "Long Pass" },
            { action_id: 2, action_type_id: [4], title: "Short Pass" },
            { action_id: 2, action_type_id: [14], title: "Throw-In" },
            { action_id: 2, action_type_id: [11], title: "Free Kick" }]
    },
    {
        title: "Dribble",
        successful: [4],
        unsuccessful: [10, 17],
        row: [
            { action_id: 4, action_type_id: [1], title: "Right" },
            { action_id: 4, action_type_id: [2], title: "Left" }
        ]
    },
    {
        title: "Cross",
        successful: [4],
        unsuccessful: [7, 8, 15],
        row: [
            { action_id: 3, action_type_id: [1], title: "Right" },
            { action_id: 3, action_type_id: [2], title: "Left" },
            { action_id: 3, action_type_id: [11], title: "Free Kick" },
            { action_id: 3, action_type_id: [12], title: "Corner" }
        ]
    },
    {
        title: "Draw Foul",
        row: [
            { action_id: 6, action_type_id: [8], title: "Regular" },
            { action_id: 6, action_type_id: [9], title: "Yellow Card" },
            { action_id: 6, action_type_id: [10], title: "Red Card" }]
    },
    {
        title: "Interception",
        row: [
            { action_id: 10, action_type_id: [1, 2], title: "Dribble" },
            { action_id: 10, action_type_id: [7], title: "Key Pass" },
            { action_id: 10, action_type_id: [6], title: "Through Pass" },
            { action_id: 10, action_type_id: [5], title: "Long Pass" },
            { action_id: 10, action_type_id: [4], title: "Short Pass" },
            { action_id: 10, action_type_id: [14], title: "Throw-In" }]
    },
    {
        title: "Saved",
        row: [
            { action_id: 8, action_type_id: [1, 2], title: "Foot" },
            { action_id: 8, action_type_id: [3], title: "Header" }
        ]
    },
    {
        title: "Clearance",
        row: [
            { action_id: 11, action_type_id: [1, 2], title: "Foot" },
            { action_id: 11, action_type_id: [3], title: "Header" }
        ]
    },
    {
        title: "Turnover",
        row: [
            { action_id: 2, action_type_id: [11], title: "Bad Pass" },
            { action_id: 4, action_type_id: [10, 12], title: "Bad Dribble" },
            { action_id: 7, action_result_id: 15, title: "Offside" },
        ]
    },
    {
        title: "Foul",
        row: [
            { action_id: 5, action_type_id: [8], title: "Regular" },
            { action_id: 5, action_type_id: [9], title: "Yellow Card" },
            { action_id: 5, action_type_id: [10], title: "Red Card" }
        ]
    },
]

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
        success: ["Free Kick", "Penalty"],
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