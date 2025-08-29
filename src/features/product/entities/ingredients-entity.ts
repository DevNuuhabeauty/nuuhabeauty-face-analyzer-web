export interface IngredientsEntity {
    name?: string | null;
    image?: string | null;
    category?: string | null;
    also_called?: string | null;
    what_it_does?: string[] | null;
    irritancy?: string | null;
    comedogenicity?: string | null;
    functions?: string[] | null;
    description?: string | null;
}




export interface ChemicalEntity {
    image?: string | null;
    compound_cid?: string | null;
    molecular_formula?: string | null;
    molecular_weight?: string | null;
    iupac_name?: string | null;
    inchi?: string | null;
    inchi_key?: string | null;
    smiles?: string | null;
}   