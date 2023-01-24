import classes from "../styles/Header.module.scss";
function Header() {
  return (
    <>
      <div className={classes.header}>
        <div className={classes.title}>Blind Chat</div>
        <a href="https://www.instagram.com/ritik_negi2002/" target="_blank">Instagram</a>
      </div>
    </>
  );
}

export default Header;
