import { FormFields } from '../components/FormFields/FormFields';

export default function Home() {
  return (
    <>
      <header />
      <main className="flex-1">
        <div className="h-full flex flex-col items-stretch bg-blue-600">
          <div className="flex-1 bg-white rounded-b-3xl">
            <FormFields
              rounds={1}
              onRoundsChange={(rounds) => console.log({ rounds })}
              breakInterval={new Date()}
              onBreakIntervalChange={(date) => console.log(date)}
              workInterval={new Date()}
              onWorkIntervalChange={(date) => console.log(date)}
            ></FormFields>
          </div>
          <div className="flex flex-col items-center flex-[0.25] pt-8 ">
            <button className="text-blue-600 bg-white text-xl px-8 h-14 rounded-full font-semibold">
              Start
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
