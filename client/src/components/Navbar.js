import { Link } from "react-scroll"
import "../assets/styles/Navbar.css"
import { useEffect, useRef } from "react"



const Navbar = () => {

    // create sticky header using ref
    const ref = useRef();  

    var lastScrollTop = 0;

    useEffect(function() {
        window.addEventListener("scroll", function(event) {
            var st = window.pageYOffset // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            // console.log(window.pageYOffset)
            if (st > lastScrollTop){
                ref.current.style.top = "-100px"
            } else if(st < lastScrollTop) {
                ref.current.style.top = "0"
            }
            lastScrollTop = st;
        })
    }, [])

    return (
        // Navbar elements
        <nav className="nav-bar px-5 d-flex flex-row" ref={ref}>
            <div className="col-6 d-flex flex-row align-items-center justify-content-start">
                <label className="nav-logo">
                        Logo
                </label>
            </div>
            <ul className="col-6 li-style-none d-flex flex-row align-items-center justify-content-end">
                <li className="nav-item">
                    <Link
                        to="Home"
                        activeClass="active"
                        smooth={true}>
                            Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                    to="About"
                    activeClass="active"
                    smooth={true}>
                        About
                    </Link>
                </li>
                <li className="nav-item">
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