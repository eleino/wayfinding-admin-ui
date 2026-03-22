// SideBar.tsx
const SideBar = () => {
    return (
        <div className="w-50 py-5 bg-sidebar-grey">
            <ul className="list-none">
                <li className="sidebar-link"><a href="/">Home</a></li>
                <li className="sidebar-link"><a href="/login">Login</a></li>
                {/* Add more links as needed */}
            </ul>
        </div>
    );
};

export default SideBar;