// display small dialog to confirm user wants to delete something

export const DeleteDialog = (props: { onConfirm: () => void, onCancel: () => void, itemName: string }) => {
    const { onConfirm, onCancel, itemName } = props;
    return (
        <div className="absolute top-0 right-0 flex items-center justify-center border border-border-grey rounded bg-black/50 w-full h-full z-10">
            <div className="p-6 shadow bg-sidebar-grey rounded">
                <p>Are you sure you want to delete {itemName}?</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onCancel} className="mr-2 px-4 py-2 bg-border-grey text-white rounded cursor-pointer">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer">Delete</button>
                </div>
            </div>
        </div>
    );
}