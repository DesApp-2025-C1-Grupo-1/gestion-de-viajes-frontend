import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { CreateChoferDto, choferControllerCreate, ChoferDto, UpdateChoferDto, useChoferControllerFindOne, choferControllerUpdate, EmpresaDto, CreateChoferDtoTipoLicencia, useEmpresaControllerFindAll, useVehiculoControllerFindAll } from '../api/generated';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CreateChoferSchema, UpdateChoferSchema, createChoferSchema} from '../api/schemas/chofer.schema';
import { tipoLicenciaSchema } from "../api/schemas/enums/tipoLicencia.schema";

export const useDriverForm = (id?: string) => {
  const navigate = useNavigate();
  const isEditing = !!id;
  const licenciasValidas = Object.values(tipoLicenciaSchema.enum);
  
  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors: formErrors , isValid},
  } = useForm<CreateChoferSchema>({
    resolver: zodResolver(createChoferSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: undefined,
      fecha_nacimiento: undefined,
      licencia: "",
      tipo_licencia: licenciasValidas[0],
      telefono: {
        codigo_pais: "",
        codigo_area: "",
        numero: ""
      },
      email: "",
      empresa: "",
      vehiculo: "",
    },
  })

  const { data, isLoading, error } = useChoferControllerFindOne(id!, { query: { enabled: isEditing } });
  const { data: companies, error: errorEmpresa, isLoading: loadingEmpresas } = useEmpresaControllerFindAll();
  const { data: vehiculos, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();

  const { notify } = useNotify("Chofer");

  useEffect(() => {
    if (isEditing && data && data.data) {
      const { _id, empresa, vehiculo, fecha_nacimiento, ...rest } = data.data ;
      const {_id: idVehiculo} = vehiculo;
      const {_id: idEmpresa} = empresa;
      reset({
        ...rest,
        fecha_nacimiento: new Date(fecha_nacimiento),
        _id,
        vehiculo: idVehiculo,
        empresa: idEmpresa,
      } as CreateChoferSchema);
    }
  }, [isEditing, data]);

  const onSubmit = async(FormData: CreateChoferSchema | UpdateChoferSchema) => {
    console.log("Datos del formulario:", data);
    if(isEditing){
      await handleUpdate(FormData as UpdateChoferSchema);
    }
    else{
      console.log(FormData)
      await handleCreate(FormData as CreateChoferSchema);
    }
  };

  const handleUpdate = async(FormData: UpdateChoferSchema) => {
    try{
      const {_id, ...dataToUpdate} = FormData;

      await choferControllerUpdate(id!, dataToUpdate as UpdateChoferDto);
      notify("update");
      navigate("/drivers");
    } catch(e) {
      const error = e as {response?: {data?: {message?: string}}};
      if(error.response?.data?.message){
        notify("error", error.response.data.message);
      }
    }
  };

  const handleCreate = async(FormData: CreateChoferSchema) => {
    try{
      const payload: CreateChoferDto = {
        ...FormData,
        //fecha_nacimiento: dayjs(FormData.fecha_nacimiento).toISOString(),
        //para no redefinir telefono y si fecha de nac (arreglar)
        telefono: {
          codigo_pais: FormData.telefono.codigo_pais ?? "",
          codigo_area: FormData.telefono.codigo_area ?? "",
          numero: FormData.telefono.numero ?? "",
        },
      };
      
      await choferControllerCreate(payload);
      notify("create");
      navigate("/drivers");
    } catch(e) {
      const error = e as {response?: {data?: {message?: string}}};
      if(error.response?.data?.message){
        notify("error", error.response.data.message);
      }
    }
  };

  return{
    onSubmit, handleSubmit, handleCreate, handleUpdate, isEditing, formErrors, register, control, isValid, reset, isLoading, error, companies, vehiculos, errorEmpresa, errorVehicles, licenciasValidas, watch, loadingAuxData: loadingEmpresas || loadingVehicles,
  }
}