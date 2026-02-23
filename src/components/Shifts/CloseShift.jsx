// import { useState } from "react";
// import { closeShift } from "../../utils/shift.util";
// import { useShift } from "../../context/ShiftContext";
// import { toast } from "react-toastify";

const CloseShift = () => {
//   const [closingCash, setClosingCash] = useState("");
//   const { activeShift, reloadShift } = useShift();

//   const handleClose = async () => {
//     const res = await closeShift({
//       shift_id: activeShift.id,
//       closing_cash: Number(closingCash),
//     });

//     if (res.success) {
//       toast.success("Shift closed");
//       reloadShift();
//     } else {
//       toast.error(res.message);
//     }
//   };

  return (
  //   <div className="pt-30">
  //     <input
  //       type="number"
  //       placeholder="Counted Cash"
  //       className="border p-2 rounded mr-2"
  //       value={closingCash}
  //       onChange={(e) => setClosingCash(e.target.value)}
  //     />

  //     <button
  //       onClick={handleClose}
  //       className="bg-red-600 text-white px-4 py-2 rounded"
  //     >
  //       Close Shift
  //     </button>
  //   </div>
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

export default CloseShift;
