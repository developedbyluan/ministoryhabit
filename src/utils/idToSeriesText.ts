const idToSeriesText = (id: number) => {
    switch (id) {
        case 0:
            return "Học tiếng Anh trên YouTube"
        default :
            return "Chung chung"
    }
}

export {idToSeriesText}