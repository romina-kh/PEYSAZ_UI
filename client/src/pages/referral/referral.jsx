import { useState, useEffect } from "react";

const ReferralCount = ({ referralCode }) => {
    const [inviteCount, setInviteCount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!referralCode) return;

        fetch(`http://localhost:5000/referrals/${referralCode}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setError(data.message);
                } else {
                    setInviteCount(data.inviteCount);
                }
            })
            .catch((err) => setError("Error fetching referral data"));
    }, [referralCode]);

    return (
        <div>
            
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <h3>People Invited: {inviteCount !== null ? inviteCount : "Loading..."}</h3>
            )}
        </div>
    );
};


export default ReferralCount;