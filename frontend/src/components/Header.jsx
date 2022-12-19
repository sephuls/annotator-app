export const Header = () => {
    const handleClickLogo = () => {
        window.location.href = "/";
    }

    return (
        <div className="header">
            <h1 className='header' onClick={handleClickLogo}>SignLab: Annotator App</h1>
        </div>
    )
}
