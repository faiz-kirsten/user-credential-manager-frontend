import { PiSpinnerGapLight } from "react-icons/pi";

// loading icon
const Loading = () => {
    return (
        <div className="loading-container">
            <PiSpinnerGapLight className="loading-icon" />
            <p>
                I apologise for the long loading times as I am using a free
                service. I appreciate your patience {"<3"}
            </p>
        </div>
    );
};

export default Loading;
