import angry from '../assets/disgust.svg';
import back from '../assets/back.svg'

export default function DisgustPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative px-6 bg-[#A9E831]">

      <button className="absolute top-6 left-6 text-black text-3xl font-bold">
        <img src={back} alt="back" className="w-[50px] h-[50px]" />
      </button>

      {/* Mood layout */}
      <div className="flex flex-col items-center gap-[150px] mb-4">
       {/* Baris atas */}
        <div>
          <Mood />
          <Mood />
        </div>

      </div>
       {/* Baris bawah */}
        <div className="flex gap-[150px] mb-[50px]">
          <Mood />
          <Mood />
        </div>

      <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-3">
        Sepertinya kamu merasa takut.<br /> Ingat, kamu aman dan semuanya bisa dihadapi perlahan.
      </h1>
    
    </div>
  );
}

function Mood() {
  return (
    <div className="flex items-center justify-center">
        <img src={disgust} alt="disgust" className="w-[150px] h-[150px]" />
    </div>
  );
}