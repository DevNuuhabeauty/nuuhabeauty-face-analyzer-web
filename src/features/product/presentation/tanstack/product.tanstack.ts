import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getListNPRAProducts } from "../../infrastructures/repositories/product.api.service";
import { removeStopWords } from "@/src/core/constant/helper";

export const useGetListNPRAProducts = () => {
    return useMutation({
        mutationFn: async ({
            productName
        }: {
            productName: string;
        }) => {
            try {
                const npraProducts = await getListNPRAProducts(productName);
                return npraProducts;
            } catch (error) {
                console.error('Error getting NPRA products:', error);
            }
        },
        onError: (error) => {
            console.error('Error getting NPRA products:', error);
        }
    });
}

export const useCheckNPRAProduct = () => {
    return useMutation({
        mutationFn: async ({
            productName
        }: {
            productName: string;
        }) => {
            // Use more specific search terms instead of just first word
            const searchTerm = getSearchTerm(productName);
            const npraProducts = await getListNPRAProducts(searchTerm);

            console.log('Product Name:', productName);
            console.log('Search Term:', searchTerm);
            console.log('Found NPRA Products:', npraProducts.length);

            // Try multiple matching strategies
            let bestMatch = null;
            let bestScore = 0;

            for (const npraProduct of npraProducts) {
                console.log('NPRA Product:', npraProduct.product_name);

                const score = calculateMatchScore(productName, npraProduct.product_name || '');
                console.log('Match Score:', score);

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = npraProduct;
                }
            }

            // Lower the threshold for a match
            if (bestScore >= 0.6) { // 60% match threshold
                console.log('✅ Found match with score:', bestScore);
                return bestMatch;
            }

            console.log('❌ No match found. Best score was:', bestScore);
            return null;
        },
        onError: (error) => {
            console.error('Error checking NPRA product:', error);
        }
    });
}

// Get better search term from product name
function getSearchTerm(productName: string): string {
    return productName.toLowerCase().split(' ')[0];
}

// Calculate match score between two product names
function calculateMatchScore(searchName: string, npraName: string): number {
    if (!npraName) return 0;

    const cleanSearch = normalizeProductName(searchName);
    const cleanNpra = normalizeProductName(npraName);

    console.log('Normalized Search:', cleanSearch);
    console.log('Normalized NPRA:', cleanNpra);

    // Multiple scoring strategies
    const exactMatch = cleanSearch === cleanNpra ? 1.0 : 0;
    const containsMatch = cleanNpra.includes(cleanSearch) ? 0.9 : 0;
    const wordMatch = calculateWordMatchScore(cleanSearch, cleanNpra);
    const fuzzyMatch = calculateFuzzyScore(cleanSearch, cleanNpra);

    // Return the highest score from different strategies
    return Math.max(exactMatch, containsMatch, wordMatch, fuzzyMatch);
}

// Normalize product names for comparison
function normalizeProductName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s%]/g, ' ') // Replace special chars with space, keep %
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .trim();
}

// Calculate word-based matching score
function calculateWordMatchScore(searchName: string, npraName: string): number {
    const searchWords = searchName.split(' ').filter(word => word.length > 1);
    const npraWords = npraName.split(' ').filter(word => word.length > 1);

    if (searchWords.length === 0) return 0;

    // Count exact word matches
    const exactMatches = searchWords.filter(word => npraWords.includes(word));

    // Count partial matches for chemical names
    const partialMatches = searchWords.filter(searchWord =>
        searchWord.length > 3 &&
        npraWords.some(npraWord =>
            npraWord.includes(searchWord) || searchWord.includes(npraWord)
        )
    );

    const totalMatches = exactMatches.length + (partialMatches.length * 0.8);
    const score = totalMatches / searchWords.length;

    console.log('Word Match Details:', {
        searchWords,
        npraWords,
        exactMatches,
        partialMatches,
        score
    });

    return score;
}

// Calculate fuzzy matching score using edit distance
function calculateFuzzyScore(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;

    const distance = levenshteinDistance(str1, str2);
    return 1 - (distance / maxLength);
}

// Calculate Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + indicator // substitution
            );
        }
    }

    return matrix[str2.length][str1.length];
}

// Helper function to get all possible consecutive substrings of specified length
function getSubstrings(str: string, length: number): string[] {
    const substrings: string[] = [];
    for (let i = 0; i <= str.length - length; i++) {
        substrings.push(str.slice(i, i + length));
    }
    return substrings;
}