import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import {
  useVehiculoControllerFindOne,
  vehiculoControllerCreate,
  vehiculoControllerUpdate,
  CreateVehiculoDto,
  UpdateVehiculoDto,
} from "../api/generated";
import { useForm } from "react-hook-form";
import { CreateVehiculoSchema, UpdateVehiculoSchema, VehiculoSchema } from "../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";


export const useVehicleForm = (id?: string) => {
  const navigate = useNavigate();
  const isEditing = !!id;
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors: formErrors , isValid},
  } = useForm<CreateVehiculoSchema>({
    resolver: zodResolver(CreateVehiculoSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      
      patente: "",
      modelo: "",
      marca: "",
      tipo: "",
      empresa: "",
      año: new Date().getFullYear(),
      peso_carga: 0,
      volumen_carga: 0,
    },
  })
  const { data } = useVehiculoControllerFindOne(id!, { query: { enabled: isEditing } });
  const { notify } = useNotify("Vehículo");

  useEffect(() => {
    if (isEditing && data && data.data) {
      const { _id, tipo, empresa, ...rest } = data.data ;
      const {_id: idTipo} = tipo;
      const {_id: idEmpresa} = empresa;
      reset({
        ...rest,
        _id,
        tipo: idTipo,
        empresa: idEmpresa,
      } as CreateVehiculoSchema);
    }
  }, [isEditing, data]);

  
  const onSubmit = async (formData: CreateVehiculoSchema | UpdateVehiculoSchema) => {
    if (isEditing) {
      await handleUpdate(formData as UpdateVehiculoSchema);
    } else {
      await handleCreate(formData as CreateVehiculoSchema);
    }
  };

  const handleCreate = async (formData: CreateVehiculoSchema) => {
    try {
      await vehiculoControllerCreate(formData as CreateVehiculoDto);
      notify("create");
      navigate("/vehicles");
    } catch (e) {
      const error = e as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message) {
        notify("error", error.response.data.message);
      }
    }
  }

  const handleUpdate = async (formData: UpdateVehiculoSchema) => {
    try {
      const {_id, ...dataToUpdate} = formData;
      
      await vehiculoControllerUpdate(id!, dataToUpdate as UpdateVehiculoDto);
      notify("update");
      navigate("/vehicles");
    } catch (e) {
      const error = e as { response?: { data?: { message?: string } } };
      if (error.response?.data?.message) {
        notify("error", error.response.data.message);
      }
    }
  }

  return {
    onSubmit,
    handleSubmit,
    handleCreate,
    handleUpdate,
    isEditing,
    formErrors,
    register,
    control,
    isValid,
    reset,
  }
}

