export const createCommand = (tagList) => {
    const command = `ffmpeg -y -i "${tagList[0].video_url}" -f lavfi -i color=color=#808080@0.7:size=240x60,format=rgba -f lavfi -i color=color=#FFA500@0.7:size=240x60,format=rgba -i "https://s3.eu-west-1.amazonaws.com/scouting4u.com/IMG/JustSmallLogo.png" -filter_complex "${tagList.map((tag, i) =>
        `[0:v]trim=120:130,setpts=PTS-STARTPTS[v${i}];[1:v]drawtext=text='${tag.action_name ?? "TEAM_ACTION"}':fontfile=ArialBold.ttf:x=(w-text_w)/2:y=(h-text_h)/2:fontsize=40:fontcolor=white[trans_gray_tx1];[v${i}][trans_gray_tx1]overlay=shortest=1:x=20:y=H-h-20[v_${i}];[0:a]atrim=120:130,asetpts=PTS-STARTPTS[a${i}];`).join("")
        }${tagList.map((tag, i) => `[v_${i}][a${i}]`).join("")
        }concat=n=${tagList.length}:v=1:a=1[outv][outa];[2:v]drawtext=text='# Kanga G':fontfile=ArialBold.ttf:x=(w-text_w)/2:y=(h-text_h)/2:fontsize=40:fontcolor=white[trans_org_tx];[outv][trans_org_tx]overlay=shortest=1:x=262:y=H-h-20[v_org];[v_org][${tagList.length}:v]overlay=W-w-20:H-h-20[v_t_logo]" -map "[v_t_logo]" -map "[outa]" -preset fast output.mp4`

    return command
}