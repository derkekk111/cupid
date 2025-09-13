import Link from "next/link"
import styles from "./navbar.module.css"

const Navbar = async () => {

    // const session = await auth();
    // console.log(session);

    return (
        <div className={styles.container}>
            <div className={styles.headerContent}>
                <Link href="/" className={styles.logo}>
                    Cupid Dating App
                </Link>
            </div>
        </div>
    )
}

export default Navbar