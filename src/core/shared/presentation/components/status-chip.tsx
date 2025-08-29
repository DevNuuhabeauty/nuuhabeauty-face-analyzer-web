const StatusChip = ({ title, value, color }: { title: string, value: string, color: string }) => {
    const getBackgroundColor = () => {
        switch (color) {
            case 'green':
                return 'bg-green-100';
            case '#FFBF00':
                return 'bg-yellow-100';
            case 'red':
                return 'bg-red-100';
            default:
                return 'bg-gray-100';
        }
    }

    const getTextColor = () => {
        switch (color) {
            case 'green':
                return 'text-green-600';
            case '#FFBF00':
                return 'text-yellow-600';
            case 'red':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    }

    return (
        <div className={`${getBackgroundColor()} ${getTextColor()} px-3 py-1 rounded-full w-fit text-center text-xs font-medium`}>
            {value}
        </div>
    )
}

export default StatusChip;