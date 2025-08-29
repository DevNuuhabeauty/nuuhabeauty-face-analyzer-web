const DefaultHeader = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="flex flex-col items-start justify-center w-full gap-1">
            <h1 className="text-2xl font-bold">
                {title}
            </h1>
            <p className="text-sm text-muted-foreground font-light">
                {description}
            </p>
        </div>

    )
}

export default DefaultHeader;