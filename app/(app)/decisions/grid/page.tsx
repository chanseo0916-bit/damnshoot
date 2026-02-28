"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/Header";
import { useAddHistory } from "@/hooks/useHistory";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { CATEGORY_TREE, CENTER_NODE, CategoryNode } from "@/lib/mandalart-data";

// 3x3 박스의 렌더링 순서를 맞추기 위한 배열 매핑 (테두리 8개 + 중앙 1개)
// [0] [1] [2]
// [3] [C] [4]
// [5] [6] [7]
function getGridItemsArray(categories: CategoryNode[]) {
    return [
        categories[0], categories[1], categories[2],
        categories[3], CENTER_NODE, categories[4],
        categories[5], categories[6], categories[7],
    ];
}

// 트리 전체에서 리프 노드(실제 음식 이름)만 추출하는 함수
function getAllLeafNodes(nodes: CategoryNode[]): CategoryNode[] {
    const leaves: CategoryNode[] = [];
    nodes.forEach(n => {
        if (n.items && n.items.length > 0) {
            leaves.push(...getAllLeafNodes(n.items));
        } else {
            leaves.push(n);
        }
    });
    return leaves;
}

export default function MandalartPage() {
    const { toast } = useToast();
    const { mutate: addHistory } = useAddHistory();

    // categoryPath 배열을 통해 몇 번째 Depth에 들어와 있는지 추적
    // [] = 대분류(Depth 1), [cat] = 중분류(Depth 2), [cat, subcat] = 소분류(Depth 3)
    const [categoryPath, setCategoryPath] = useState<CategoryNode[]>([]);

    const [isAnimating, setIsAnimating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    // 현재 진입해 있는 최상단 카테고리
    const currentCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : null;

    const handleCategoryClick = (category: CategoryNode, index: number) => {
        if (isAnimating) return;

        // 중앙 칸(무작위 추천) 클릭 시
        if (category.id === CENTER_NODE.id || category.id.endsWith("_center")) {
            // 현재 화면에 있는 카테고리들의 모든 하위 아이템 중 1개 뽑기
            const nodesToRandomize = currentCategory && currentCategory.items
                ? [currentCategory]
                : CATEGORY_TREE;

            const allItems = getAllLeafNodes(nodesToRandomize);
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            handleFinalSelection(randomItem.label);
            return;
        }

        // 하위 분류가 있는 노드 클릭 시 (Zoom In)
        if (category.items && category.items.length > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCategoryPath([...categoryPath, category]);
                setIsAnimating(false);
            }, 300); // 줌인 애니메이션 시간
        } else {
            // 하위 분류가 없는 노드 (최종 메뉴 클릭)
            handleFinalSelection(category.label);
        }
    };

    const handleFinalSelection = (menuName: string) => {
        setResult(menuName);
        toast("success", `🎉 당첨! 오늘의 메뉴는 [${menuName}] 입니다!`);
        addHistory({
            foodId: "",
            foodName: menuName,
            method: "grid_mandalart",
        });
    };

    const handleBack = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCategoryPath(p => p.slice(0, -1));
            setResult(null);
            setIsAnimating(false);
        }, 300); // 줌아웃 애니메이션 시간
    };

    const handleReset = () => {
        setResult(null);
        setCategoryPath([]);
    };

    // 현재 화면에 그릴 9칸 배열 계산
    const currentGrid = currentCategory && currentCategory.items
        ? [
            ...currentCategory.items.slice(0, 4),
            { ...currentCategory, id: currentCategory.id + "_center", isCenter: true },
            ...currentCategory.items.slice(4, 8)
        ]
        : getGridItemsArray(CATEGORY_TREE);

    return (
        <AppLayout title="메뉴 추천표" showBack>
            <div className="flex flex-col items-center flex-1 w-full h-full pb-6 pt-4 relative px-2 overflow-y-auto">
                {/* 헤더 안내문 */}
                <div className="text-center mb-6 px-4">
                    <h1 className="text-foreground tracking-tight text-[26px] font-extrabold leading-tight mb-2">
                        메뉴 추천표
                    </h1>
                    <p className="text-sm text-foreground-muted break-keep">
                        {currentCategory
                            ? `'${currentCategory.label}' 골랐군요! 하나를 확실히 찍어보세요.`
                            : `어떤 계열이 땡기나요? 표를 눌러 좁혀가거나 중앙을 눌러 무작위 추천을 받으세요.`}
                    </p>
                </div>

                {/* Grid Container */}
                <div className="relative w-full aspect-square max-w-[340px] mb-8 select-none">
                    {/* Background Neon Glow */}
                    <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full scale-90 pointer-events-none mix-blend-screen z-0"></div>

                    {/* 3x3 Grid */}
                    <div
                        className={`relative z-10 w-full h-full grid grid-cols-3 grid-rows-3 gap-2 p-1 transition-all duration-300 ease-in-out
                            ${isAnimating ? (currentCategory ? 'scale-[0.2] opacity-0' : 'scale-[2] opacity-0') : 'scale-100 opacity-100'}
                        `}
                    >
                        {currentGrid.map((node: any, idx) => {
                            const isCenter = idx === 4;

                            // 컬러 바리에이션
                            let bgClass = "bg-surface-dark/90 hover:bg-surface-hover hover:border-primary/50 border-white/10";
                            let textClass = "text-foreground font-semibold";

                            if (isCenter && categoryPath.length === 0) {
                                // 메인화면 중앙
                                bgClass = "bg-primary text-white border-primary shadow-[0_0_15px_rgba(140,43,238,0.5)]";
                                textClass = "text-white font-extrabold text-lg drop-shadow-md";
                            } else if (isCenter && categoryPath.length > 0) {
                                // 서브화면 중앙
                                bgClass = "bg-surface-darker border-primary/30 text-primary";
                                textClass = "text-primary font-bold";
                            }

                            // 결과 로직
                            const isWinner = result === node.label;
                            if (result && isWinner) {
                                bgClass = "bg-accent-pink text-white border-accent-pink shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-pulse";
                                textClass = "text-white font-extrabold scale-110 transition-transform";
                            } else if (result && !isWinner) {
                                bgClass += " opacity-20 grayscale";
                            }

                            return (
                                <button
                                    key={`${node.id}-${idx}`}
                                    onClick={() => handleCategoryClick(node, idx)}
                                    disabled={!!result || (isCenter && categoryPath.length > 0)}
                                    className={`flex items-center justify-center p-2 text-center rounded-xl border transition-all duration-300 ${bgClass}`}
                                >
                                    <span className={`whitespace-pre-line leading-snug ${textClass}`}>
                                        {node.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 하단 컨트롤 (되돌아가기 / 다시하기) */}
                <div className="flex w-full px-6 gap-3 mt-auto mb-2 relative z-20">
                    {categoryPath.length > 0 && !result && (
                        <button
                            onClick={handleBack}
                            className="flex-1 py-4 bg-surface-dark border-2 border-border text-foreground-muted rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-hover transition-colors"
                        >
                            <ArrowLeft size={20} />
                            이전 단계로
                        </button>
                    )}

                    {result && (
                        <button
                            onClick={handleReset}
                            className="w-full py-4 bg-primary text-white hover:bg-primary-light rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(140,43,238,0.3)] transition-all"
                        >
                            처음부터 다시 고르기
                        </button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
