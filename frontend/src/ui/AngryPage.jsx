import angry from '../assets/angry.svg';
import back from '../assets/back.svg'

export default function AngryPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative px-6 bg-[#FF5358]">

      <button className="absolute top-6 left-6 text-black text-3xl font-bold">
        <img src={back} alt="back" className="w-[50px] h-[50px]" />
      </button>

      {/* Mood layout */}
      <div className="flex flex-col items-center gap-4">
       {/* Baris atas */}
        <div>
          <Mood />
        </div>

      </div>
       {/* Baris bawah */}
        <div className="flex gap-[150px] mb-[50px]">
          <Mood />
          <Mood />
        </div>

      <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-3">
        Sepertinya Anda sedang merasa kesal <br />Tarik napas dalam dulu, ya
      </h1>
    
    </div>
  );
}

function Mood() {
  return (
    <div className="flex items-center justify-center">
        <img src={angry} alt="angry" className="w-[150px] h-[150px]" />
    </div>
  );
}