
import { useEffect, useState, useRef } from 'react';
import Select from 'react-select'
import toast, { Toaster } from 'react-hot-toast';

import { utcToZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { useRouter } from 'next/router';
import Image from 'next/image'
import Link from 'next/link'
import Modal from '../../components/Modal'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })


export default function Bank() {
   
   const [bank, setBanks] = useState([])
   
   const [banks, setBank] = useState([])
   const [movements, setMovements] = useState([])
   const [showModal, setShowModal] = useState(false);
   const [showModalMinus, setShowModalMinus] = useState(false);
   const [transfertToBanks, setTransfertToBanks] = useState(false);

   const [saldo, setSaldo] = useState(0);
   const [selectedOption, setSelectedOption] = useState(null);

   const saldoRef = useRef()

   const router = useRouter();
   const { id } = router.query;

   const postData = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
   }

   const notifySuccess = (promise) => {
      toast.promise(promise, {
    
         loading: 'Loading',
         success: 'Ingreso realizado con exito',
         error: 'Error when fetching',
       });
   }

   const formatDateSpanish = (dateString, formatString) => {
      const date = new Date(dateString)
      const formattedDate = format(date, formatString, { locale: es })
      return formattedDate
    }


    const groupByDate = (transactions) => {
      // Crea un objeto para almacenar las transacciones agrupadas
      const grouped = {}
    
      for (const transaction of transactions) {
        // Formatea la fecha de la transacción
        const date = formatDateSpanish(transaction.created_at, 'EEEE d MMMM')
    
        // Si esta fecha no está en el objeto agrupado, añade una entrada para ella
        if (!grouped[date]) {
          grouped[date] = []
        }
    
        // Añade la transacción a la entrada correspondiente
        grouped[date].push(transaction.id)
      }
    
      return grouped
    }



   const getBank = async () => {
      const res = await fetch(`http://localhost:3000/api/hello/?id=${id}`, postData);
      const data = await res.json();
      setBanks(data.bank);
  
   }
   const getAllBanks = async () => {
      const res = await fetch(`http://localhost:3000/api/getAllBanks`, postData);
      const data = await res.json();
      const formattedBanks = data.banks.map(bank => ({
         value: bank.id, // o cualquier otro campo único
         label: bank.name,
         logo: bank.logo,
     }));
      setBank(formattedBanks);

   }

   function formatChileanPesos(amount) {
      return "$" + Number(amount).toLocaleString('es-CL');
  }

  function getMovementsByBanks() {
      const postData = {
         method: 'GET',
         headers: { 'Content-Type': 'application/json' },
      }
      fetch(`http://localhost:3000/api/getMovementsByBanks/?id=${id}`, postData)
         .then(res => res.json())
         .then(data => {
            console.log(data.movements)
            if (data.error) {
               alert(data.error)
            } else {
               setMovements(data.movements)
            }
      })
  }
  
   function transfertToBanksSaldo(){
      
      const saldo = saldoRef.current.value || null
      const idBank = selectedOption.value || null

      
     
      const postData = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ saldo, idBank, id })
      }

      console.log(postData)

      fetch('http://localhost:3000/api/transfertToBanks', postData)
      .then(res => res.json())
      .then(data => {

     
         if (data.error) {
            alert(data.error)
        
         } else {

            if (data.message == 'No se puede retirar más de lo que hay en la cuenta') {
               alert(data.message)
            }else{
               alert(data.message)
               getBank();
               getMovementsByBanks();
            }
           
            
         }
      })
   }

   function addMount(type){
      const saldo = saldoRef.current.value || null
      const typeSaldo = type || null
      const postData = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ saldo, id, typeSaldo })
      }

       // Mostrar estado de carga
       const loadingToast = toast.loading('Loading...');

      fetch('http://localhost:3000/api/addMount', postData)
      .then(res => res.json())
      .then(data => {
         if (data.error) {
            toast.error(data.error);
         } else if (data.message === 'No se puede retirar más de lo que hay en la cuenta') {
            toast.error(data.message);
         } else {
            getBank();
            getMovementsByBanks();
            toast.success('Ingreso realizado con exito');
         }
      })
      .catch(error => {
         toast.error(`Error when fetching: ${error.toString()}`);
      })
      .finally(() => {
         // Ocultar el estado de carga después de la resolución de la promesa
         toast.dismiss(loadingToast);
      });


   }

   
   const CustomOption = ({ data, innerProps }) => (
      <div className='flex items-center px-4 py-3 cursor-pointer' {...innerProps}>
         <img className='mr-2 rounded-sm' src={`/uploads/${data.logo}`} width="30" alt={data.label} />
         <span>{data.label}</span>
      </div>
    );

    const handleChange = (option) => {
      setSelectedOption(prevState => {
         console.log(`Previo:`, prevState);
         console.log(`Nuevo:`, option);
         return option;
       });
   }  

   const customStyles = {
      control: (provided) => ({
        ...provided,
        width: '100%',
        paddingLeft: '1.25rem',
        backgroundColor: '#44444424',
        borderRadius: '1rem',
        height: '3rem',
        borderColor: 'transparent',
        color: '...',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: '...',
      }),
      menu: (provided) => ({
         ...provided,

         borderRadius: '1rem',
         marginTop: '0.5rem',
         backgroundColor: '#474747',
         boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
      }),
    }

   useEffect(() => {
      if (id) {
         getMovementsByBanks();
         getBank();
         getAllBanks();
      }
    
   }, [id])




    
   return (
      <>
         <div class="">
         
         
         <main
               className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
            >
               <div class="absolute left-0 w-20  h-fixed h-screen top-0 nav-siderbar flex items-center justify-center">
                  <div aria-hidden="true" class="c-lesPJm c-lesPJm-iixAuFD-css"></div>
                  
                  <div class="flex flex-col">
                     <div onClick={() => setTransfertToBanks(true)} class="transfert-to-banks px-5 py-5 hover:bg-gray-50/5 rounded-md transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="m12.37 2.15 9 3.6c.35.14.63.56.63.93V10c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V6.68c0-.37.28-.79.63-.93l9-3.6c.2-.08.54-.08.74 0ZM22 22H2v-3c0-.55.45-1 1-1h18c.55 0 1 .45 1 1v3ZM4 18v-7M8 18v-7M12 18v-7M16 18v-7M20 18v-7M1 22h22" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                     </div>
                     <div onClick={() => setShowModalMinus(true)}  class="add-mount px-5 py-5 hover:bg-gray-50/5 rounded-md transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M8 12h8M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                     </div>
                     <div onClick={() => setShowModal(true)} class="add-mount px-5 py-5 hover:bg-gray-50/5 rounded-md transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M8 12h8M12 16V8M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                     </div>
                     
                  </div>

               </div>
               <div class="absolute top-3 right-3 ">
                  <p className="top-0 left-0 flex items-center w-full pt-8 pb-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                     Saldo: <span class="font-bold text-2xl ml-2">{formatChileanPesos(bank.saldo)} CLP</span>
                  </p>
               </div>
               <div className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
                  <p className="top-0 left-0 flex items-center w-full pt-8 pb-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-[600px] lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                  <div class="grid grid-cols-5 w-full">
                     <div class="col col-span-3 flex items-center justify-center">
                        <Image className='mr-3' src={`/uploads/${bank.logo}`} alt={bank.name} width={140} height={140} />
                     </div>
                     <div class="flex flex-col col-span-2">
                        <div class="flex w-full">
                           <div class="flex flex-col">
                              <span class="text-[#d1d1d1] text-xs">Nombre:</span>
                              {bank.name}
                           </div>
                           <div class="ml-auto">
                              <code className="mb-2 font-mono font-bold text-right">{bank.tipo ? bank.tipo : 'no tiene cuenta '}</code>
                           </div>
                        </div>
                        <div class="ml-auto flex flex-col mt-auto items-center">
                           <span class="text-[#d1d1d1] text-xs text-right mb-2 flex justify-end w-full">Numero de tarjeta:</span>
                           **** **** **** {bank.numero ? bank.numero.slice(-4) : '0000'}
                        </div>
                     </div>
                     
                  </div>
                  </p>
                  <div class=" w-full">
                     <div class=" pt-10 border-b border-[#d1d1d1]/20 w-full">
                        <div class=" py-5 text-[#d1d1d1] flex items-center">
                           <div class="mr-3">
                              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="m12.37 2.15 9 3.6c.35.14.63.56.63.93V10c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V6.68c0-.37.28-.79.63-.93l9-3.6c.2-.08.54-.08.74 0ZM22 22H2v-3c0-.55.45-1 1-1h18c.55 0 1 .45 1 1v3ZM4 18v-7M8 18v-7M12 18v-7M16 18v-7M20 18v-7M1 22h22" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                           </div>
                           
                           Movimientos
                        </div>
                     </div>
                     <div class=" w-full py-4">
                        <div class="flex flex-col">
                        {Object.entries(groupByDate(movements)).map(([date, transactions]) => (
                        <div key={date}>
                           <div class=" flex items-center mb-6 mt-6">
                              <svg class="mr-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9.5 13.75c0 .97.75 1.75 1.67 1.75h1.88c.8 0 1.45-.68 1.45-1.53 0-.91-.4-1.24-.99-1.45l-3.01-1.05c-.59-.21-.99-.53-.99-1.45 0-.84.65-1.53 1.45-1.53h1.88c.92 0 1.67.78 1.67 1.75M12 7.5v9" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 3v4h4M22 2l-5 5" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              <h2 class=" uppercase font-bold text-[#d1d1d1] text-xs">{date}</h2>
                           </div>
                          
                           {transactions.map((transactionId) => {
                              // Encuentra la transacción original por su ID
                              const transaction = movements.find(movement => movement.id === transactionId);
                              
                              return (
                                 <div key={transactionId} class="mb-5">
                                    <div class="flex items-center">
                                       <div class="">
                                          <div class="">
                                             <span class="text-[#d1d1d1] text-xs">{formatDateSpanish(transaction.created_at, 'd MMMM yyyy h:mm:ss aaaa')}</span>
                                          </div>
                                          <span class="">
                                         
                                             {
                                                transaction.type === 'ingreso' ? 'Ingreso' : 
                                                transaction.type === 'Transferencia' ? 'Transferencia' : 
                                                'Egreso'
                                             }
                                           </span>
                                       </div>
                                       <div class="flex flex-col ml-auto">
                                          {
                                          (transaction.type === 'ingreso') ? (
                                             <div class="flex flex-col">
                                                <div class="ml-auto transform -rotate-45 mb-1">
                                                   <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                      <path stroke="#00b894" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"></path>
                                                   </svg>
                                                </div>
                                                <div class="text-[#d1d1d1] text-xs text-right flex justify-end w-full">
                                                   <span class="w-[100px] font-bold ml-1 text-[#00b894]">{formatChileanPesos(transaction.egreso)} CLP</span>
                                                </div>
                                             </div>
                                           ) : (transaction.type === 'transferencia') ? (

                                             <div class="flex flex-col">
                                                <div class="ml-auto transform rotate-45 mb-1">
                                                   <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                      <path stroke="#ff7675" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"></path>
                                                   </svg>
                                                </div>
                                                   <div class="text-[#d1d1d1] text-xs text-right flex justify-end w-full">
                                                   <span class="w-[100px] font-bold ml-1 text-[#ff7675]">{formatChileanPesos(transaction.egreso)} CLP</span>
                                                </div>
                                             </div>

                                          ) : (
                                             <div class="flex flex-col">
                                                <div class="ml-auto transform rotate-45 mb-1">
                                                   <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                      <path stroke="#ff7675" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"></path>
                                                   </svg>
                                                </div>
                                                   <div class="text-[#d1d1d1] text-xs text-right flex justify-end w-full">
                                                   <span class="w-[100px] font-bold ml-1 text-[#ff7675]">{formatChileanPesos(transaction.egreso)} CLP</span>
                                                </div>
                                             </div>
                                             )
                                          }
                                          
                                       </div>
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     ))}

                                {/*<div key={movement.id} class="mb-5">
                                    <div class=" flex items-center">
                                       <div class="">
                                          <div class="">
                                             <span class="text-[#d1d1d1] text-xs">{formatDateSpanish(movement.created_at, 'd MMMM yyyy h:mm:ss aaaa')}</span>
                                          </div>
                                          <span class="">{movement.type === 'ingreso' ? 'Ingreso' : 'Egreso'}:</span>
                                       </div>
                                       <div class="flex flex-col ml-auto">
                                          {movement.type === 'ingreso' ?
                                             <div class="ml-auto transform  -rotate-45 mb-1">
                                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                   <path stroke="#00b894" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"></path>
                                                </svg>
                                             </div>
                                          
                                             :
                                             'ges'
                                          }
                                         <div class="text-[#d1d1d1] text-xs text-right  flex justify-end w-full">
                                           <span class="w-[100px] font-bold ml-1 text-[#00b894]">{formatChileanPesos(movement.egreso)} CLP </span>
                                         </div>
                                       </div>
                                    </div>
                                 </div>  */}
                           
                        </div>
                     </div>
                  </div>
                  
            
               </div>

             

               <div class="">
                  <Link href="/" class="underline">
                     Regresar al home
                  </Link>
               </div>

               {showModal &&
                     <Modal class="h-full" onClose={() => setShowModal(false)}>
                        <div class="flex flex-col h-full">
                           <div class="flex flex-col h-full">
                           <h4 class="text-center text-[#acacac] text-xl">Agregar saldo a la cuenta</h4>
                           
                           <div class="pt-10 px-5">
                              <input type="text" className='w-full pl-5 bg-[#44444424] 
                              rounded h-12 text-[' placeholder="Saldo" ref={saldoRef}  />
                           </div>
                           
                     
                           <div class="mt-auto pb-16 mt-16 flex justify-center">
                              <button onClick={() => addMount('entry')} className='w-full text-[#acacac] bg-[#4f14ff85] rounded h-11' >
                                 Añadir
                              </button>
                           </div>
                           </div>
                        </div>
                     </Modal>
               }

               {showModalMinus &&
                     <Modal class="h-full" onClose={() => setShowModalMinus(false)}>
                        <div class="flex flex-col h-full">
                           <div class="flex flex-col h-full">
                           <h4 class="text-center text-[#acacac] text-xl">Retirar saldo de tu cuenta</h4>
                           
                           <div class="pt-10 px-5">
                              <input type="text" className='w-full pl-5 bg-[#44444424] 
                              rounded h-12 text-[' placeholder="Saldo" ref={saldoRef}  />
                           </div>
                           
                     
                           <div class="mt-auto pb-16 mt-16 flex justify-center">
                              <button onClick={() => addMount('remove')} className='w-full text-[#acacac] bg-[#4f14ff85] rounded h-11' >
                                 Retirar  
                              </button>
                           </div>
                           </div>
                        </div>
                     </Modal>
               }

               {transfertToBanks &&
                     <Modal class="h-full" onClose={() => setTransfertToBanks(false)}>
                        <div class="flex flex-col h-full  px-10">
                           <div class="flex flex-col h-full">
                           <h4 class="text-center text-[#acacac] text-xl">Transferir a otro banco</h4>
                           
                           <div class="pt-10">
                              <label class="text-right block text-neutral-500 font-bold text-[13px] mb-3"><span class="font-normal">Saldo:</span> {formatChileanPesos(bank.saldo)} </label>
                              <input type="text" className='w-full pl-5 bg-[#44444424] 
                              rounded h-12 text-[' placeholder="Saldo" ref={saldoRef}  />
                           </div>

                           <div class="py-3 flex justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                 <path stroke="#616161" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M9.01 20.5l-5.02-5.01M9.01 3.5v17M14.99 3.5l5.02 5.01M14.99 20.5v-17"></path></svg>
                           </div>


                           <Select
                              options={banks}
                              components={{
                                 Option: CustomOption
                              }}
                              styles={customStyles}
                              onChange={handleChange}
                              placeholder="Selecciona un banco"
                              value={selectedOption}
                           />
                           
                     
                           <div class="  mt-16 flex justify-center mb-7">
                              <button onClick={() => transfertToBanksSaldo()} className='w-full text-[#acacac] bg-[#4f14ff85] rounded h-11' >
                                 Transferir
                              </button>
                           </div>
                           </div>
                        </div>
                     </Modal>
               }  

         </main>

         
         <Toaster />        
         </div>
      </>
   )


}