import React from "react";

function RegisterBar({ stage }) {
    const barstyle = ["h-1 bg-gray-200 w-[50%] rounded-xs", "h-1 bg-[#4169E2] w-[50%] rounded-xs"];
    const step = [
        [1, 0],
        [1, 1],
    ];
    return (
        <div className="flex flex-row gap-5">
            <div className={barstyle[step[stage][0]]}></div>
            <div className={barstyle[step[stage][1]]}></div>
        </div>
    );
}

export default RegisterBar;
