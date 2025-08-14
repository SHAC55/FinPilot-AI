import React from "react";
import { Lightbulb, TrendingUp } from "lucide-react"; // nice icons

const AiBudgetAnalysis = () => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          AI Budget Analysis
        </h2>
      </div>

      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
        fugiat minus minima ex sapiente aliquid, ducimus possimus. Quibusdam
        laboriosam, voluptatem aliquam deserunt iure quam blanditiis libero
        ducimus sed porro magnam explicabo commodi nesciunt perspiciatis
        consectetur iste impedit, ad minima laborum minus accusantium a
        voluptates! Et aperiam accusamus a quia. Odio cum aliquam animi iure
        libero aliquid dolor nesciunt ea ad repellat soluta recusandae a
        debitis, quos tempora modi tenetur nulla facere ab iusto porro? Vel
        dolores rerum magnam eaque tempora. Lorem ipsum dolor sit amet
        consectetur, adipisicing elit. Culpa iusto earum magni voluptas ipsam
        repellendus at consequatur quam beatae unde, quas maxime veniam deserunt
        deleniti inventore pariatur ab exercitationem adipisci voluptate
        recusandae rem labore. Ullam aut suscipit repudiandae soluta inventore!
      </p>

      {/* Highlighted Insight */}
      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <span className="text-green-700 text-sm font-medium">
          Your expenses are 12% lower than last month 🎯
        </span>
      </div>
    </div>
  );
};

export default AiBudgetAnalysis;
