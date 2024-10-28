import Footer from "./Footer";


const DonationInfo = () => {
    return (
        <div className="m-10 p-5 max-w-screen-2xl mx-auto">
            <div className="md:flex max-w-5xl gap-12 mx-auto">
                <h1 className="text-5xl font-semibold w-full">Facts About Donations</h1>
                <div className=" w-full">
                    <p className="text-2xl">The gift of blood saves lives, and the demand for blood and blood products is significant. Every few seconds, someone in Bangladesh needs blood, whether for surgeries, accidents, or medical treatments. In Bangladesh, thousands of units of blood are required each year to meet the needs of hospitals and patients, especially in emergencies.</p>
                    <p className="text-2xl">Learning about blood types, compatibility, and the different ways to donate is essential to ensure safe and effective donations. By understanding the importance of lifesaving blood, you can make an informed decision to donate and contribute to saving lives in your community. Blood donations are particularly vital in Bangladesh due to frequent shortages and the growing demand for safe blood.</p>
                </div>
            </div>
            <div className="max-w-7xl">
                <h1 className="text-5xl font-semibold my-3">Blood Types</h1>
                <p className="text-2xl">
                    Knowing your blood type is crucial, whether you're a donor or someone in need of blood. You might be amazed at how many lives can be touched by your generous donation, regardless of your blood type. Each donation, no matter the type, plays a vital role in saving lives.</p><br /><br />

                <p className="text-2xl">Explore how different blood types vary in frequency, and while some may be more common or rare every type is essential. Whatever your blood type, your contribution can make a lasting impact. We encourage everyone to donate and help save lives.
                </p>
                <div className="my-10 ">
                    <div className="overflow-x-auto rounded-lg">
                        <table className="table p-5 bg-slate-50 md:w-full">
                            {/* head */}
                            <thead>
                                <tr className="text-lg bg-red-300">
                                    <th></th>
                                    <th>Blood Type</th>
                                    <th>Can Donate Red Blood Cells To</th>
                                    <th>Can Receive Red Blood Cells From</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                {/* row 1 */}
                                <tr className="">
                                    <th>1</th>
                                    <td>O</td>
                                    <td>O, A, B, AB</td>
                                    <td>O, O-</td>
                                </tr>
                                {/* row 2 */}
                                <tr>
                                    <th>2</th>
                                    <td>O-</td>
                                    <td>Everyone</td>
                                    <td>O-</td>
                                </tr>
                                {/* row 3 */}
                                <tr>
                                    <th>3</th>
                                    <td>A</td>
                                    <td>A, AB</td>
                                    <td>A, A-, O,O-</td>
                                </tr>
                                {/* row 4 */}
                                <tr>
                                    <th>4</th>
                                    <td>A-</td>
                                    <td>A, A-, AB, AB-</td>
                                    <td>A-, O-</td>
                                </tr>
                                {/* row 5 */}
                                <tr>
                                    <th>5</th>
                                    <td>B</td>
                                    <td>B, AB</td>
                                    <td>B, B-, O, O-</td>
                                </tr>
                                {/* row 6 */}
                                <tr>
                                    <th>6</th>
                                    <td>B-</td>
                                    <td>B, B-, AB, AB-</td>
                                    <td>B-, O-</td>
                                </tr>
                                {/* row 7 */}
                                <tr>
                                    <th>7</th>
                                    <td>AB</td>
                                    <td>AB</td>
                                    <td>Everyone</td>
                                </tr>
                                 {/* row 8 */}
                                 <tr>
                                    <th>7</th>
                                    <td>AB-</td>
                                    <td>AB, AB-</td>
                                    <td>AB-, A-, B-, O-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <p>
            
            </p>
            <Footer></Footer>
        </div>

    );
};

export default DonationInfo;