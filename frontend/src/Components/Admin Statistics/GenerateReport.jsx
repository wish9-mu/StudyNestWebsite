import React, {useState, useEffect} from "react";

const GenerateReport = () => {

    const [reportType, setReportType] = useState("");

    const generateReport = () => {
        
    };

    return (
        <>
            <div>
                {/*<small>Click a tutor to access their Performance Metrics</small>*/}
            </div>
            <div>
                <button className="generate-report-button" onClick={ () => { 
                    setReportType("profiles");
                    generateReport();
                    }}>Generate Users Report</button>
                <button className="generate-report-button" onClick={ () => { 
                    setReportType("bookings");
                    generateReport();
                    }}>Generate Bookings Report</button>
                <button className="generate-report-button" onClick={ () => { 
                    setReportType("archBookings");
                    generateReport();
                    }}>Generate Archived Bookings Report</button>
                {/*<small>Click to generate performance rating report.</small>*/}
            </div>
        </>
    )
}

export default GenerateReport;