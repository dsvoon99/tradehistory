import { Link } from "react-scroll"

const Navbar = () => {

    return (
        // Navbar elements
        <nav>
            <ul>
                <li>
                    <Link
                        to="Home"
                        activeClass="active"
                        smooth={true}>
                            Home
                    </Link>
                </li>
                <li>
                    <Link
                    to="About"
                    activeClass="active"
                    smooth={true}>
                        About
                    </Link>
                </li>
                <li>
                    <Link
                        to="Game"
                        activeClass="active"
                        smooth={true}>
                            The Game
                    </Link>
                </li>
            </ul>
        </nav>
    )

}

export default Navbar;