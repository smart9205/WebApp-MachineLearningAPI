import React from 'react';

import Step1 from '../../../assets/render-step1.png';
import Step2 from '../../../assets/click_on_setup.png';
import Step3 from '../../../assets/render-step3.png';
import Step4 from '../../../assets/render-step4.png';
import Step5 from '../../../assets/render-step5.png';
import Step6 from '../../../assets/render-step6.png';

import '../coach_style.css';

const showList = [
    { image: Step1, title: 'Download the Render Tool by clicking' },
    { image: Step2, title: "Install the 'Render Tool' by clicking on Setup.exe file" },
    { image: Step3, title: "Click the 'Browse' button to select the XML file" },
    { image: Step4, title: "Click the 'Browse' button to select the output path" },
    { image: Step5, title: "Select 'Keep files' switch to save the video clips" },
    { image: Step6, title: "Click the 'Process' button to create the final video file" }
];

const SettingsRenderTool = ({ t }) => {
    return (
        <div className="tab-page settings-render">
            <div className="render-container-split">
                <div className="render-container">
                    {showList.slice(0, 3).map((item, index) => (
                        <div key={index} className="render-item">
                            <p className="render-item-text" style={{ textTransform: 'uppercase' }}>
                                {t('Step')} #{index + 1}
                            </p>
                            <div className="render-item-container">
                                <img src={item.image} />
                                <div className="horizontal-4">
                                    <p className="normal-text">{t(item.title)}</p>
                                    {index === 0 && (
                                        <a className="normal-text" href="https://soccer-s4u-bucket.s3.eu-west-1.amazonaws.com/files/Scouting4U+Video+Render.zip" target="_blank">
                                            HERE
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="render-container">
                    {showList.slice(3, 6).map((item, index) => (
                        <div key={index + 3} className="render-item">
                            <p className="render-item-text" style={{ textTransform: 'uppercase' }}>
                                {t('Step')} #{index + 4}
                            </p>
                            <div className="render-item-container">
                                <img src={item.image} />
                                <p className="normal-text">{t(item.title)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsRenderTool;
