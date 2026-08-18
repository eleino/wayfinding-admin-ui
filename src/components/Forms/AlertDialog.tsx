import { createPortal } from "react-dom";

export interface AlertDialogType {
    title: string;
    description: string;
    type: "error" | "success" | "info";
}
export const AlertDialog = (props: AlertDialogType & { onConfirm: () => void }) => {
    const { title, description, type, onConfirm } = props;
    // convert \n in description to line breaks
    const formattedDescription = description.split("\n").map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 w-full h-full z-50">
            <div className="bg-sidebar-grey rounded-lg p-6 border-3 border-border-grey max-w-190 shadow-lg">
                <h2 className={`text-xl font-semibold mb-4 border-b border-border-grey ${type === "error" ? "text-red-500" : type === "success" ? "text-lab-green-dark" : "text-lab-blue"}`}>
                    {title}
                </h2>
                <p className="mb-6">{formattedDescription}</p>
                <div className="flex justify-end space-x-4">

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-lab-blue text-white rounded"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    , document.body);
}