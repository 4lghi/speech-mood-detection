import angry from '../assets/happy.svg';
import back from '../assets/back.svg'

export default function HappyPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative px-6 bg-[#FFD46F]">

      <button className="absolute top-6 left-6 text-black text-3xl font-bold">
        <img src={back} alt="back" className="w-[50px] h-[50px]" />
      </button>

      {/* Mood layout */}
      <div className="flex flex-col items-center mb-10 gap-4">
       {/* Baris atas */}
        <div>
          <Mood />
          <Mood />
        </div>

      </div>
       {/* Baris bawah */}
        <div className="flex gap-[100px] mb-[50px]">
          <Mood />
        </div>

      <h1 className="text-2xl md:text-3xl font-bold text-black text-center mb-3">
        Kami menangkap nada positif dalam suara Anda.<br /> Tetap semangat!
      </h1>
    
    </div>
  );
}

function Mood() {
  return (
    <div className="flex items-center justify-center">
        <img src={happy} alt="happy" className="w-[150px] h-[150px]" />
    </div>
  );
}