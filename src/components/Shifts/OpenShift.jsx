// import { useState } from "react";
// import { openShift } from "../../utils/shift.util";
// import { useShift } from "../../context/ShiftContext";
// import { toast } from "react-toastify";

const OpenShift = () => {
  // const [openingCash, setOpeningCash] = useState("");
  // const { reloadShift } = useShift();

  // const handleOpen = async () => {
  //   if (!openingCash) {
  //     toast.error("Enter opening cash");
  //     return;
  //   }

  //   const res = await openShift({
  //     opening_balance: Number(openingCash),
  //   });

  //   if (res.success) {
  //     toast.success("Shift opened");
  //     reloadShift();
  //   } else {
  //     toast.error(res.message);
  //   }
  // };

 return (
  //   <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
  //     <h2 className="text-xl text-gray-700 font-bold mb-4">Open Shift</h2>

  //     <input
  //       type="number"
  //       placeholder="Opening Cash"
  //       className="w-full border text-gray-500 p-2 mb-4 rounded"
  //       value={openingCash}
  //       onChange={(e) => setOpeningCash(e.target.value)}
  //     />

  //     <button
  //       onClick={handleOpen}
  //       className="w-full bg-blue-600 text-white py-2 rounded"
  //     >
  //       Open Shift
  //     </button>
  //   </div>
  // );
<div className="flex items-center justify-center p-40 bg-white-900 text-gray-500">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4"> Coming Soon</h1>
        <p className="text-lg mb-6">
          We’re working hard to bring you something amazing. Stay tuned!
        </p>
        <div className="animate-spin">
          <span className="text-2xl">⌛</span>
        </div>
      </div>
    </div>
 );

};

export default OpenShift;
