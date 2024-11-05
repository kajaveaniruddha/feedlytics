import BarChartRatings from "./bar-ratings-chart";
import PieChartMessageCount from "./pie-chart-message-count";
import PieChartMessageSentimentAnalysis from "./pie-chart-message-sentiment-analysis";

type Props = {};

const Page = (props: Props) => {

  return (
    <section className="container py-8 min-h-screen">
      <div className="grid grid-cols-2 gap-4 pb-8">
        <PieChartMessageCount />
        <BarChartRatings/>
        <PieChartMessageSentimentAnalysis />
      </div>
    </section>
  );
};

export default Page;
