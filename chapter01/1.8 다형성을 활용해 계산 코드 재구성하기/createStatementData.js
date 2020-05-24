class PerformanceCalculator {
    // 공연료 계산기 클래스
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        throw new Error('서브 클래스에서 처리하세요');
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() { // 포인트 계산 방식이 조금 다른 처리 로직을 서브클래스로 내리기
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case 'tragedy': return new TragedyCalculator(aPerformance, aPlay);
        case 'comedy': return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`알 수 없는 장르: ${aPlay.type}`);
    }
}

module.exports = function createStatementData(invoice, plays) { // 중간 데이터 생성을 전담
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); // 생성자대신 팩토리함수 사용
        const result = Object.assign({}, aPerformance); // 얕은 복사 수행
        result.play = calculator.play; // 중간 데이터에 연극 정보를 저장
        result.amount = calculator.amount; // aountFor() 대신 계산기의 함수 이용
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0); // for 반복문을 파이프라인으로
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0); // for 반복문을 파이프라인으로
    }
}