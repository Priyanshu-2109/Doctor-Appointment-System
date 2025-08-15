


const changeAvailability = async (req, res) => {
    try {

        const {docId} = req.body;

        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available
        });
        res.json({ success: true, message: "Doctor's availability changed successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Internal Server Error" });
    }
}

const doctorList = async (req, res) => {

    try {

        const doctors = await doctorModel.find({}).select(['-password','-email']);
        res.json({ success: true, doctors });

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Internal Server Error" });
    }
}

export {changeAvailability, doctorList};