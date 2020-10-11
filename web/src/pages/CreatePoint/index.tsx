import React, {useEffect, useState, ChangeEvent} from 'react';
import {Link} from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Logo from '../../assets/logo.svg';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet'
import axios from 'axios';
import api from '../../services/api';

import "./CreatePoint.css";

interface Item{
  id:number;
  title:string;
  img_url:string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}


const CreatePoint = () =>{

    const [items, setItems] = useState<Item[]>([]);

    //API IBGE Api de localidades
    const [ufs, setUfs] = useState<string[]>([]);
    const [seletedUf, setSeletedUf] = useState<string>("0");
    const [seletedCity, setseletedCity] = useState<string>("0");
    const [cities, setCities] = useState<string[]>([]);

    // API MAPS
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0]);
    const [seletedPositon, SetseletedPositon] = useState<[number, number]>([0,0,]);

    useEffect(()=>{
      navigator.geolocation.getCurrentPosition(position=>{
        // const latitude = position.coords.latitude;
        // const longitude = position.coords.longitude;
        
        const {latitude, longitude} = position.coords;
        setinitialPosition([latitude, longitude]);

      })
    },[])

    useEffect(()=>{
      api.get('items').then(response =>{
        setItems(response.data.serializedItems);
      }).catch(error => {
        console.log(error);
      });
    },[]);

    useEffect(()=>{
      axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
          const ufInitials = response.data.map(uf => uf.sigla);       
          setUfs(ufInitials);
        }).catch(error => {
        console.log(error);
      });
    }, []);
    
    useEffect(() => {
      if (seletedUf === "0") {
        return ;
      }
      axios
        .get<IBGECityResponse[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${seletedUf}/municipios`
        )
        .then((response) => {
          const cityNames = response.data.map(city => city.nome);
          setCities(cityNames);
        }).catch(error => {
        console.log(error);
      });;

    }, [seletedUf]);

    useEffect(()=>{
      if(seletedCity === '0'){
        return 
      }
      const params = {
        'access_key': 'c8a0dc4ec6d3d76a0a387783f0e467d4',
        'query': `${seletedCity}`,
        'region_code': `${seletedUf}`,
        'limit': 1,
      }

      axios.get('http://api.positionstack.com/v1/forward', {params}) .then(response => {
        setinitialPosition([response.data.data[0].latitude, response.data.data[0].longitude])
      })
      .catch(error => {
        console.log(error);
      });
    }, [seletedCity])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
      const uf = event.target.value;
      setSeletedUf(uf);
    }

    function handleSeletedCity(event:ChangeEvent<HTMLSelectElement>){
      const city = event.target.value;
      setseletedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
      SetseletedPositon([event.latlng.lat, event.latlng.lng]);
    }

    return (
      <div id="page-create-point">
        <header>
          <img src={Logo} alt="Ecoleta" />
          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <form>
          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input type="text" name="name" id="name" />
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input type="text" name="email" id="email" />
              </div>

              <div className="field">
                <label htmlFor="Whatsapp">WhatsApp</label>
                <input type="text" name="whatsapp" id="whatsapp" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select
                  onChange={handleSelectUf}
                  value={seletedUf}
                  name="uf"
                  id="uf"
                >
                  <option value="0">Selecione um estado</option>
                  {ufs.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  onChange={handleSeletedCity}
                  value={seletedCity}
                >
                  <option value="0">Selecione uma cidade</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Map center={initialPosition} zoom={12} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={seletedPositon} />
            </Map>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>
            <ul className="items-grid">
              {items.map((item) => (
                <li className="" key={item.id}>
                  <img src={item.img_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>
    );
}

export default CreatePoint;