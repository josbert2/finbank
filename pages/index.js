import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef  } from 'react'

import multer from 'multer';
import { join } from 'path';


import Modal from '../components/Modal'
const inter = Inter({ subsets: ['latin'] })




export default function Home() {
  const [banks, setBanks] = useState([])
  const [created, setCreated] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null)
  const [updatingBank, setUpdatingBank] = useState(null)
  const [totalSaldo, setTotalSaldo] = useState(0)
  const [BankCount, setBankCount] = useState(0)

  const bankNameRef = useRef()
  const numeroRef = useRef()
  const logoRef = useRef(null)
  const tipoRef = useRef()
  const correoRef = useRef()
  const rutRef = useRef()
  const nombresRef = useRef()
  const apellidosRef = useRef()
  // get banks

  async function getBanks() {
    const postData = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    const res = await fetch('http://localhost:3000/api/hello', postData)
    const response = await res.json()
    setBanks(response.banks)

    let total = 0;
    response.banks.map((bank) => {
      total += bank.saldo
    })
    setTotalSaldo(total)
   
  }


  async function addBanks(){
    const bankName = bankNameRef.current.value || null
    const tipo = tipoRef.current.value || null
    const numero = numeroRef.current.value || null
    const logo = logoRef.current.value || null
    const imagen = image
    const correo = correoRef.current.value || null
    const rut = rutRef.current.value || null
    const nombres = nombresRef.current.value || null
    const apellidos = apellidosRef.current.value || null

    


   
 
    

    if (!bankName || !tipo || !numero || !logo) return

    const postData =  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: bankName,
        tipo: tipo,
        numero: numero.toString(),
        logo: logo.split("\\").pop(),
        image: imagen,
        correo: correo,
        rut: rut,
        nombres: nombres,
        apellidos: apellidos
      })
    }

  


   

    const response = await fetch('http://localhost:3000/api/hello', postData)

   
    if (response.status === 200) {
      const data = await response.json()
    
      setBanks([...banks, data.bank])
      setCreated(true)
      setTimeout(() => {
        setCreated(false)
      }, 3000)
    }
  }
  async function updateBank(id){
    const bankToUpdate = banks.find(bank => bank.id === id)
    if (!bankToUpdate) return
    setUpdatingBank(bankToUpdate)
    setSelectedImage(`/uploads/${bankToUpdate.logo}`)
    setShowModal(true)
  }
  function formatChileanPesos(amount) {
    return "$" + Number(amount).toLocaleString('es-CL');
  }


  const handleImageUpload = async (e) => {
    const file = logoRef.current?.files[0]
    const reader = new FileReader();
    

    reader.onload = () => {
      const base64 = reader.result;
      setSelectedImage(base64);
      setImage(base64);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function formatChileanPesos(amount) {
    return "$" + Number(amount).toLocaleString('es-CL');
  }

  const getCountAllBanks = async () => {
    const res = await fetch('http://localhost:3000/api/getCountAllBanks')
    const response = await res.json()
    setBankCount(response.count)
  }

  useEffect(() => {
    getBanks()
    getCountAllBanks()
  }, [])


  // querys prisma

  


  return (
    <main
      className={` min-h-screen   ${inter.className}`}
    >
    <header className="grid grid-cols-3 px-10 bg-white shadow">
      <div class="flex items-center">
        <svg width="130" height="22" id="fintual-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1812 400" class="fintual-logo"><path fill="#282828" fill-rule="evenodd" clip-rule="evenodd" d="M4680.1 336V205.3h99.8v-50.1h-99.8V69.1h130.4V18.9H4624V336h56.1zM4862 84.9c17.9 0 31.9-14 31.9-32.1 0-18.5-14-32.1-31.9-32.1-17.4 0-32.3 13.6-32.3 32.1 0 18.1 14.9 32.1 32.3 32.1zm122.1 138.8V336h-53.4V121.1h53.4v34.1c11-26.7 44.6-38.7 66.7-38.7 55.2 0 86.1 36.4 86.1 99V336h-53.4V220.5c0-34.1-20.7-51.5-44.6-51.5-24.4 0-54.8 13.3-54.8 54.7zM5435 341.1c21.6 0 55.7-12 66.7-38.7V336h53.4V121.1h-53.4v112.3c0 41.9-30.4 55.2-54.8 55.2-23.9 0-44.6-17.5-44.6-52V121.1h-53.4v120.6c0 62.6 30.9 99.4 86.1 99.4zm338.6-34.1c-14.7 23-45.1 33.6-71.3 33.6-56.6 0-105.9-43.7-105.9-112.3 0-69 48.8-111.8 105.4-111.8 27.2 0 57.1 10.6 71.8 33.1v-28.5h53.4V336h-53.4v-29zm-66.9-16.5c-33.1 0-60.3-26.7-60.3-62.6 0-35.9 27.2-61.7 60.3-61.7 30.8 0 62.1 23.9 62.1 61.7 0 37.7-29.4 62.6-62.1 62.6zM5924 21.6V337h-53.4V35.9l53.4-14.3zM4889 336V121h-53.4v215h53.4zm417.9 1.8c-7.8 1.8-19.3 2.8-27.6 2.8-49.7 0-82.8-30.4-82.8-87.4v-83.4h-42.8V121h42.8V67.1l51.5-13.8V121h58.9v48.8H5248v82.4c0 28.5 17.5 40 42.3 40 5.5 0 11.5-.5 16.6-1.8v47.4z" class="st0"></path><circle fill="#a0c8ff" cx="8532" cy="192" r="134" class="st1"></circle><path fill="#005ad6" d="M8532 192h-250v250c138.1 0 250-112 250-250z" class="st2"></path><path fill="#003f96" d="M8496.2 321.1a248.7 248.7 0 0 0 35.9-129.1h-134c0 61.5 41.5 113.4 98.1 129.1z" class="st3"></path><path fill="#282828" fill-rule="evenodd" clip-rule="evenodd" d="M568.1 356V225.3h99.8v-50.1h-99.8V89.1h130.4V38.9H512V356h56.1zM750 104.9c17.9 0 31.9-14 31.9-32.1 0-18.5-14-32.1-31.9-32.1-17.4 0-32.3 13.6-32.3 32.1 0 18.1 14.8 32.1 32.3 32.1zm122.1 138.8V356h-53.4V141.1h53.4v34.1c11-26.7 44.6-38.7 66.7-38.7 55.2 0 86.1 36.4 86.1 99V356h-53.4V240.5c0-34.1-20.7-51.5-44.6-51.5-24.4 0-54.8 13.3-54.8 54.7zM1323 361.1c21.6 0 55.7-12 66.7-38.7V356h53.4V141.1h-53.4v112.3c0 41.9-30.4 55.2-54.8 55.2-23.9 0-44.6-17.5-44.6-52V141.1h-53.4v120.6c0 62.6 30.8 99.4 86.1 99.4zm338.6-34.1c-14.7 23-45.1 33.6-71.3 33.6-56.6 0-105.9-43.7-105.9-112.3 0-69 48.8-111.8 105.4-111.8 27.2 0 57.1 10.6 71.8 33.1v-28.5h53.4V356h-53.4v-29zm-66.9-16.5c-33.1 0-60.3-26.7-60.3-62.6 0-35.9 27.2-61.7 60.3-61.7 30.8 0 62.1 23.9 62.1 61.7 0 37.7-29.4 62.6-62.1 62.6zM1812 41.6V357h-53.4V55.9l53.4-14.3zM777 356V141h-53.4v215H777zm417.8 1.8c-7.8 1.8-19.3 2.8-27.6 2.8-49.7 0-82.8-30.4-82.8-87.4v-83.4h-42.8V141h42.8V87.1l51.5-13.8V141h58.9v48.8h-58.9v82.4c0 28.5 17.5 40 42.3 40 5.5 0 11.5-.5 16.6-1.8v47.4z" class="st0"></path><circle fill="#a0c8ff" cx="250" cy="142" r="134" class="st1"></circle><path fill="#005ad6" d="M250 142H0v250c138.1 0 250-112 250-250z" class="st2"></path><path fill="#003f96" d="M214.2 271.1C236.9 233.4 250 189.2 250 142H116c.1 61.5 41.6 113.4 98.2 129.1z" class="st3"></path><path fill="#f3f6fa" fill-rule="evenodd" clip-rule="evenodd" d="M2880.1 356V225.3h99.8v-50.1h-99.8V89.1h130.4V38.9H2824V356h56.1zM3062 104.9c17.9 0 31.9-14 31.9-32.1 0-18.5-14-32.1-31.9-32.1-17.4 0-32.3 13.6-32.3 32.1 0 18.1 14.8 32.1 32.3 32.1zm122.1 138.8V356h-53.4V141.1h53.4v34.1c11-26.7 44.6-38.7 66.7-38.7 55.2 0 86.1 36.4 86.1 99V356h-53.4V240.5c0-34.1-20.7-51.5-44.6-51.5-24.4 0-54.8 13.3-54.8 54.7zM3635 361.1c21.6 0 55.7-12 66.7-38.7V356h53.4V141.1h-53.4v112.3c0 41.9-30.4 55.2-54.8 55.2-23.9 0-44.6-17.5-44.6-52V141.1h-53.4v120.6c0 62.6 30.8 99.4 86.1 99.4zm338.6-34.1c-14.7 23-45.1 33.6-71.3 33.6-56.6 0-105.9-43.7-105.9-112.3 0-69 48.8-111.8 105.4-111.8 27.2 0 57.1 10.6 71.8 33.1v-28.5h53.4V356h-53.4v-29zm-66.9-16.5c-33.1 0-60.3-26.7-60.3-62.6 0-35.9 27.2-61.7 60.3-61.7 30.8 0 62.1 23.9 62.1 61.7 0 37.7-29.4 62.6-62.1 62.6zM4124 41.6V357h-53.4V55.9l53.4-14.3zM3089 356V141h-53.4v215h53.4zm417.8 1.8c-7.8 1.8-19.3 2.8-27.6 2.8-49.7 0-82.8-30.4-82.8-87.4v-83.4h-42.8V141h42.8V87.1l51.5-13.8V141h58.9v48.8h-58.9v82.4c0 28.5 17.5 40 42.3 40 5.5 0 11.5-.5 16.6-1.8v47.4z" class="st4"></path><circle fill="#a0c8ff" cx="2562" cy="142" r="134" class="st1"></circle><path fill="#2979e8" d="M2562 142h-250v250c138.1 0 250-112 250-250z" class="st5"></path><path fill="#f3f6fa" d="M2526.2 271.1a248.7 248.7 0 0 0 35.9-129.1h-134c0 61.5 41.5 113.4 98.1 129.1z" class="st6"></path><path fill="#f3f6fa" fill-rule="evenodd" clip-rule="evenodd" d="M6480.1 336V205.3h99.8v-50.1h-99.8V69.1h130.4V18.9H6424V336h56.1zM6662 84.9c17.9 0 31.9-14 31.9-32.1 0-18.5-14-32.1-31.9-32.1-17.4 0-32.3 13.6-32.3 32.1 0 18.1 14.9 32.1 32.3 32.1zm122.1 138.8V336h-53.4V121.1h53.4v34.1c11-26.7 44.6-38.7 66.7-38.7 55.2 0 86.1 36.4 86.1 99V336h-53.4V220.5c0-34.1-20.7-51.5-44.6-51.5-24.4 0-54.8 13.3-54.8 54.7zM7235 341.1c21.6 0 55.7-12 66.7-38.7V336h53.4V121.1h-53.4v112.3c0 41.9-30.4 55.2-54.8 55.2-23.9 0-44.6-17.5-44.6-52V121.1h-53.4v120.6c0 62.6 30.9 99.4 86.1 99.4zm338.6-34.1c-14.7 23-45.1 33.6-71.3 33.6-56.6 0-105.9-43.7-105.9-112.3 0-69 48.8-111.8 105.4-111.8 27.2 0 57.1 10.6 71.8 33.1v-28.5h53.4V336h-53.4v-29zm-66.9-16.5c-33.1 0-60.3-26.7-60.3-62.6 0-35.9 27.2-61.7 60.3-61.7 30.8 0 62.1 23.9 62.1 61.7 0 37.7-29.4 62.6-62.1 62.6zM7724 21.6V337h-53.4V35.9l53.4-14.3zM6689 336V121h-53.4v215h53.4zm417.9 1.8c-7.8 1.8-19.3 2.8-27.6 2.8-49.7 0-82.8-30.4-82.8-87.4v-83.4h-42.8V121h42.8V67.1l51.5-13.8V121h58.9v48.8H7048v82.4c0 28.5 17.5 40 42.3 40 5.5 0 11.5-.5 16.6-1.8v47.4z" class="st4"></path><circle fill="#a0c8ff" cx="9532" cy="192" r="134" class="st1"></circle><path fill="#2979e8" d="M9532 192h-250v250c138.1 0 250-112 250-250z" class="st5"></path><path fill="#f3f6fa" d="M9496.2 321.1a248.7 248.7 0 0 0 35.9-129.1h-134c0 61.5 41.5 113.4 98.1 129.1z" class="st6"></path></svg>
      </div>   
      <div class="menu-container">
        <ul class="flex items-center gap-5">
          <li class="text-[#000]/50 font-bold text-sm flex">
            <Link href="/" className='block px-2 py-5 active'>Overview</Link>
          </li>
          <li class="text-[#000]/50 text-sm flex">
            <Link href="/" className='block px-2 py-5 '>Statistics</Link>
          </li>
          <li class="text-[#000]/50 text-sm flex">
            <Link href="/" className='block px-2 py-5'>Transactions</Link>
          </li>
          <li class="text-[#000]/50 text-sm flex">
            <Link href="/" className='block px-2 py-5 '>Reports</Link>
          </li>
        </ul>
      </div> 
      <div class="">
      
      </div>
    </header>
    <div class="px-10 pt-10">
      <div class="grid grid-cols-3">
        <div class="bg-white rounded-lg">
          <div class=" py-3">
          <h2 class="text-neutral-700 text-center">My Accounts ({BankCount}) </h2>
          </div>
        </div>
      </div>
    </div>
     
    </main>
  )
}
