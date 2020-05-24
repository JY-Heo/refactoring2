class PerformanceCalculator {
    // 공연료 계산기 클래스
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() { // amountFor() 함수의 코드를 계산기 클래스로 복사
        let result = 0;
        switch (this.play.type) { // amountFor 함수가 매개변수로 받던 정보를 계산기 필드에서 바로 얻음
            case 'tragedy':
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${this.play.type}`);
        }
        return result; // 함수 안에서 값이 바뀌는 변수 반환
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ('comedy' === this.play.type)
            result += Math.floor(this.performance.audience / 5);
        return result;
    }
}

class TragedyCalculator extends PerformanceCalculator {

}

class ComedyCalculator extends PerformanceCalculator {

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