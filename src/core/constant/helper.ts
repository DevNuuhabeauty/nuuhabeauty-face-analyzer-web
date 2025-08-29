import { AnalysisEntity } from "@/src/features/analyzer/entities/analysis-entity";
import { ConcernEntity } from "@/src/features/analyzer/entities/product-entity";

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const capitalizeWords = (words: string) => {
    return words.split(' ').map(word => {
        // Capitalize first letter of each word
        const firstLetter = word.charAt(0).toUpperCase();
        const restOfWord = word.slice(1).toLowerCase();
        return firstLetter + restOfWord;
    }).join(' ');
}


const removeDuplicateConcerns = (diseases: ConcernEntity[]) => {
    return diseases.filter((disease, index, self) =>
        index === self.findIndex(t => t.name === disease.name)
    );
}

const formatDateDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

//04 Dec 2024 04:30
const formatDateDayTime = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
}


const getSkinCondition = (analysis: AnalysisEntity) => {
    if (analysis.skin_condition === 'excellent') {
        return {
            title: 'Excellent',
            color: 'green',
            value: 100
        }
    }
    // if (analysis.skin_condition === 'good') {
    //     return {
    //         title: 'Good',
    //         color: 'green',
    //         value: 75
    //     }
    // }
    if (analysis.skin_condition === 'moderate') {
        return {
            title: 'Moderate',
            color: '#FFBF00',
            value: 60
        }
    }
    if (analysis.skin_condition === 'concerning') {
        return {
            title: 'Concerning',
            color: 'red',
            value: 25
        }
    }
    return {
        title: 'Excellent',
        color: 'green',
        value: 100
    }
};


const isBad = (analysis: AnalysisEntity) => {
    if (analysis.skin_condition === 'moderate' || analysis.skin_condition === 'concerning') {
        return true;
    }
    return false;
}



const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) {
        return 'text-red-500';
    } else if (confidence >= 0.3) {
        return 'text-green-500';
    } else {
        return 'text-gray-500';
    }
}


const getConfidenceName = (confidence: number) => {
    if (confidence >= 0.7) {
        return 'High';
    } else if (confidence >= 0.3) {
        return 'Medium';
    } else {
        return 'Low';
    }
}

const confidenceBgColor = (confidence_percent: number) => {
    if (confidence_percent >= 0.7) {
        return 'bg-red-500';
    } else if (confidence_percent >= 0.3) {
        return 'bg-green-500';
    } else {
        return 'bg-gray-500';
    }
}


//captilize first letter of each word
const capitalizeFirstLetterOfEachWord = (str: string) => {
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

const getHighConcerns = (diseases: ConcernEntity[]) => {
    if (!diseases || diseases.length === 0) return null;

    let maxConfidence = -Infinity;
    let highestConcern = null;

    for (const disease of diseases) {
        if (disease.confidence_percent && disease.confidence_percent > maxConfidence) {
            maxConfidence = disease.confidence_percent;
            highestConcern = disease.name;
        }
    }

    return highestConcern ?? '-';
};

const getLowConcerns = (diseases: ConcernEntity[]) => {
    if (!diseases || diseases.length === 0) return null;

    let minConfidence = Infinity;
    let lowestConcern = null;

    for (const disease of diseases) {
        console.log('Concern', disease)
        if (disease.confidence_percent && disease.confidence_percent < minConfidence) {
            minConfidence = disease.confidence_percent;
            lowestConcern = disease.name;
        }
    }
    return lowestConcern ?? '-';
};

const extractYear = (citation: string) => {
    const yearMatch = citation.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? yearMatch[0] : null;
};

const extractJournal = (citation: string) => {
    const journalMatch = citation.match(/Int J Toxicol|Pediatrics|[A-Za-z]+ J|J [A-Za-z]+|[A-Za-z]+\./);
    return journalMatch ? journalMatch[0].replace(/\.$/, '') : "Journal";
};



const removeStopWords = (productName: string): string => {
    // Convert to lowercase first
    let cleanedName = productName.toLowerCase();

    // Remove special characters, numbers, and 'x'
    cleanedName = cleanedName.replace(/[\/\(\)\[\]0-9x]/g, ' ')
        .replace(/[^a-z\s]/g, ' ') // Remove any non-letter characters except spaces
        .replace(/\s+/g, ' ')      // Normalize spaces
        .trim();

    // Remove common stop words and connecting words
    const stopWords = ['and', 'with', 'for', 'the', 'a', 'an', 'by', 'in', 'of', 'to', 'at'];
    const words = cleanedName.split(' ');
    const filteredWords = words.filter(word => !stopWords.includes(word));

    return filteredWords.join(' ');
}



const checkLocationinDescription = (location: string, description: string) => {
    if (location.toLocaleLowerCase().includes('not detected')) {
        return false;
    }
    if (description.toLowerCase().includes(location.toLowerCase())) {
        return true;
    }
    return false;
}



export {
    checkLocationinDescription,
    capitalizeFirstLetter,
    capitalizeWords,
    removeDuplicateConcerns,
    formatDateDay,
    getSkinCondition,
    formatDateDayTime,
    isBad,
    getConfidenceColor,
    getConfidenceName,
    confidenceBgColor,
    capitalizeFirstLetterOfEachWord,
    getHighConcerns,
    getLowConcerns,
    extractYear,
    extractJournal,
    removeStopWords
}