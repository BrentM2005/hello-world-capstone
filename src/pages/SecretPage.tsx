import Secret from "../components/Secret"

export const SecretPage = () => {
    return (
        <div className="pt-5">
            <h2 className="text-6xl font-bold mb-6 pb-8 text-center bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                Secret
            </h2>
            <p className="text-center text-lg">Shhhhhhh, this is a secret, don't tell no one.</p>
            <p className="text-center text-lg">Nothing to see here anyway bruh, just turn around.</p>
            <Secret />
        </div>
    )
}