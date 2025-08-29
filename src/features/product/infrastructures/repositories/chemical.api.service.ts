import { CONCERN_API_URL } from "@/src/core/constant";

import axios from "axios";
import { ChemicalEntity } from "../../entities/ingredients-entity";

export const getChemical = async (productName: string): Promise<ChemicalEntity> => {
    const response = await axios.get(`${CONCERN_API_URL}/pubchem-chemical`, {
        params: {
            query: productName
        }
    });

    const chemical: ChemicalEntity = {
        iupac_name: response.data.data.chemical.name,
        compound_cid: response.data.data.chemical.cid?.toString(),
        molecular_formula: response.data.data.chemical.formula,
        molecular_weight: response.data.data.chemical.molecular_weight,
        inchi_key: response.data.data.chemical.inchikey

    };

    return chemical;
}