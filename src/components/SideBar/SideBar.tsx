// SideBar.tsx
const SideBar = () => {
    return (
        <div className="w-[200px]">
            <h3>SideBar</h3>
            <ul className="list-none">
                <li><a href="/">Home</a></li>
                <li><a href="/login">Login</a></li>
                {/* Add more links as needed */}
            </ul>
        </div>
    );
};

export default SideBar;