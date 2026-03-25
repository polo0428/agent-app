import { tool } from 'ai';
import { z } from 'zod';

const MOCK_DATA: Record<
  string,
  {
    name: string;
    course: string;
    score: number;
    rating: 'excellent' | 'good' | 'needs_improvement';
    evaluation: string;
  }
> = {
  张老师: {
    name: '张老师',
    course: '高等数学',
    score: 92,
    rating: 'excellent',
    evaluation:
      '张老师教学态度严谨，课堂条理清晰，善于将抽象概念具象化。学生满意度 95%，作业批改及时且反馈详细。课堂互动频率高，能有效调动学生积极性。建议在课后答疑时间上适当增加。',
  },
  李老师: {
    name: '李老师',
    course: '大学英语',
    score: 78,
    rating: 'good',
    evaluation:
      '李老师口语流利，教学热情高。课堂以学生为中心，小组讨论活跃。不足之处在于课件更新频率偏低，部分教学案例时效性不足。学生反馈希望增加听力训练环节，整体教学效果良好。',
  },
  王老师: {
    name: '王老师',
    course: '数据结构',
    score: 88,
    rating: 'excellent',
    evaluation:
      '王老师逻辑思维清晰，代码演示规范，能结合工程实践讲解理论。实验课指导耐心细致，学生编程能力提升明显。课堂节奏偶尔偏快，建议对重难点适当放慢讲解速度。',
  },
  赵老师: {
    name: '赵老师',
    course: '思想政治理论',
    score: 65,
    rating: 'needs_improvement',
    evaluation:
      '赵老师备课充分，但课堂互动较少，学生参与度不高。教学方式以单向讲授为主，建议融入案例分析和小组讨论。考核方式单一，可增加过程性评价。学生到课率有待提升。',
  },
};

async function fetchEvaluationFromBackend(name: string) {
  await new Promise(resolve => setTimeout(resolve, 1200));

  if (MOCK_DATA[name]) return MOCK_DATA[name];

  const randomScore = 60 + Math.random() * 40;
  const rating: 'excellent' | 'good' | 'needs_improvement' =
    randomScore >= 85 ? 'excellent' : randomScore >= 70 ? 'good' : 'needs_improvement';
  return {
    name,
    course: '通用课程',
    score: Math.round(randomScore * 10) / 10,
    rating,
    evaluation: `${name}综合评分 ${randomScore.toFixed(1)} 分，教学水平${
      rating === 'excellent' ? '优秀' : rating === 'good' ? '良好' : '有待提升'
    }。建议结合学生反馈和听课记录做进一步分析。`,
  };
}

export const getTeachingEvaluation = tool({
  description:
    '查询教师的教学质量评价数据。当用户询问某位教师的教学评价、课堂表现、教学评分时调用此工具。',
  inputSchema: z.object({
    name: z.string().describe('教师姓名，如 张老师、李老师'),
  }),
  execute: async ({ name }) => fetchEvaluationFromBackend(name),
});

export const tools = {
  get_teaching_evaluation: getTeachingEvaluation,
};
