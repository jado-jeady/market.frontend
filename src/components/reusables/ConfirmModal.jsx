import React from "react";
// Assuming you use lucide-react for Loader2 like your main file.
// If not, you can replace it with a standard CSS spinner.
import { Loader2 } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message,
  cart = [], // Pass the cart array here
  total = 0, // Pass the numerical total here
  isLoading = false, // Pass your loading state here
  onConfirm,
  onCancel,
  confirmText = "Yes, Confirm",
  cancelText = "No, Go Back",
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-[#0c0704]/85 backdrop-blur-[2px] flex items-center justify-center p-3 z-50 animate-fadeIn">
      {/* Modal Dialog Card */}
      <div className="w-full max-w-[300px] bg-[#1a100a] border border-[#2c1a10] rounded-xl p-4 shadow-2xl flex flex-col gap-3 transform scale-100 transition-transform">
        {/* Text Content Area */}
        <div className="text-center">
          <p className="text-[#f5ede2] text-[12px] font-black tracking-wide leading-snug">
            {title}
          </p>
          {message && (
            <p className="text-[#6b5444] text-[10px] mt-1 leading-relaxed font-medium">
              {message}
            </p>
          )}
        </div>

        {/* Dynamic Items List */}
        {cart.length > 0 && (
          <div className="bg-[#120b06] border border-[#2c1a10] rounded-lg p-2 max-h-full overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-[10px]"
              >
                <span className="text-[#f5ede2] truncate max-w-[140px]">
                  <span className="text-[#c8924a] font-bold mr-1">
                    {item.quantity}x
                  </span>
                  {item.name}
                </span>
                <span className="text-[#6b5444] font-medium whitespace-nowrap">
                  {(item.price * item.quantity).toLocaleString()} Frw
                </span>
              </div>
            ))}

            {/* Breakline and Total Summary */}
            <div className="h-px bg-[#2c1a10] my-0.5" />
            <div className="flex justify-between items-center text-[10px] font-black uppercase">
              <span className="text-[#6b5444]">Total</span>
              <span className="text-[#c8924a]">
                {total.toLocaleString()} Frw
              </span>
            </div>
          </div>
        )}

        {/* Action Button Grid */}
        <div className="flex gap-2 w-full mt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2 px-3 rounded-lg text-[10px] font-bold bg-[#231510] border border-[#3a2418] text-[#6b5444] hover:text-[#f5ede2] hover:bg-[#2c1a10] active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2 px-3 rounded-lg text-[10px] font-black bg-[#c8924a] text-[#1a100a] hover:bg-[#e0a855] active:scale-[0.97] shadow-md shadow-[#c8924a]/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={10} className="animate-spin" />
                Printing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
