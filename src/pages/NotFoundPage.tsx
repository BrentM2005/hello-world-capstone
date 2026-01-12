export const NotFoundPage = () => {
    return (
        <div className="pt-5">
            <h2 className="text-6xl font-bold mb-6 pb-8 text-center bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                404 - Page Not Found
            </h2>
            <p className="text-center text-lg">The page you are looking for doesn't exist... dumbass.</p>
            <p className="text-center text-lg">Click on one of the pages in the navigation bar.</p>
            <img src="404img.gif" className="mx-auto mt-8 w-64 h-64" />
        </div>
    )
}