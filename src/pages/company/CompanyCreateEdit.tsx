import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Company } from "../../types";
import { FormCompany } from "../../components/company/formCompany";
import { SectionHeader } from "../../components/SectionHeader";
import { createCompany, fetchCompanyById, updateCompany } from '../../lib/apiCompany';

export default function CompanyCreateEdit () {
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isEditing && id){
            setLoading(true);
            fetchCompanyById(id!).then((company) => setEditingCompany(company));
        }
    }, [id]);

    const handleSubmit = async(FormData: Partial<Company>) => {
        try{
            if(isEditing && id){
                await updateCompany(id, FormData);
            }
            else{
                await createCompany(FormData);
            }
            navigate('/companies');
        }
        catch(err){
            console.error("Error al guardar la empresa", err);
        }
    };

    return(
        <>
            <SectionHeader
                title= {isEditing? "Editar empresa" : "Crear empresa"}
                description= {isEditing? "Modificar los datos de la empresa" : "Cargar datos de la empresa"}
            />
            <FormCompany  
                onSubmit={handleSubmit}
                editingCompany={editingCompany}
                isEditing={isEditing}
            />
        </>
    )
}