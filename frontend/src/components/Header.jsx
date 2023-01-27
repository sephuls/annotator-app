// import logo from '/uva_logo.png';

export const Header = () => {
    const handleClickLogo = () => {
        window.location.href = "/";
    }

    return (
        <div className="header">
            <img src={process.env.PUBLIC_URL + 'uva_logo.png'} className='uva-logo'/>
            <img src={process.env.PUBLIC_URL + 'signlab_logo.png'} className='signlab-logo'/>
            <h1 className='header' onClick={handleClickLogo}>
                SignLab: Annotator App
            </h1>

        </div>
    )
}
