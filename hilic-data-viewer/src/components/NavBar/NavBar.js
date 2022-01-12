import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements"

function NavBar() {
    return (
        <div>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle>Home</NavLink>
                    <NavLink to="/calculator" activeStyle>Calculator</NavLink>
                </NavMenu>

            </Nav>
        </div>
    );
}

export default NavBar;