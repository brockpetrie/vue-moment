import Vue from 'vue/dist/vue'
import VueMoment from '../vue-moment'
import moment from 'moment-timezone'

Vue.use(VueMoment, {
    moment,
})

let now = moment()
const tomorrow = moment().add(1, 'day')

const vm = new Vue({
    template: '<div>{{ now | moment(...args) }}</div>',
    data() {
        return {
            now,
            args: [
                'YYYY-MM-DD',
            ],
        }
    },
}).$mount();



describe('VueMoment', () => {
    describe('installing plugin', () => {
        it('loads prototype', () => {
            expect(typeof vm.$moment).toEqual('function')
        })

        it('prototype works', () => {
            expect(vm.$moment(now).format('YYYY-MM-DD')).toEqual(now.format('YYYY-MM-DD'))
        })

        it('sets locale', () => {
            vm.$moment.locale('fr')
            expect(vm.$moment.locale()).toEqual('fr')
        })
    })

    describe('using filter', () => {
        it('formats date', () => {
            expect(vm.$el.textContent).toContain(now.format('YYYY-MM-DD'))
        })

        describe('relative dates', () => {
            it('simple', (done) => {
                vm.args = ['from']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain('a few seconds ago')
                    done()
                })
            })

            it('change reference', (done) => {
                vm.args = ['from', tomorrow]
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain('a day ago')
                    done()
                })
            }) 

            it('remove prefix', (done) => {
                vm.args = ['from', tomorrow, true]
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain('a day')
                    done()
                })
            }) 
        })

        describe('calendar', () => {
            it('simple', (done) => {
                vm.args = ['calendar']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.calendar())
                    done()
                })
            }) 
        })

        describe('maths', () => {
            it('add', (done) => {
                vm.args = ['add', '1 day']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().add(1, 'days').toISOString())
                    done()
                })
            }) 

            it('subtract', (done) => {
                vm.args = ['subtract', '1 day']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().subtract(1, 'days').toISOString())
                    done()
                })
            }) 

            it('timezone', (done) => {
                vm.args = ['timezone', 'America/Los_Angeles', '']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().tz('America/Los_Angeles').format())
                    done()
                })
            }) 
        })

        describe('chaining', () => {
            it('simple', (done) => {
                vm.args = ['add', '1 day', 'YYYY-MM-DD']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().add(1, 'days').format('YYYY-MM-DD'))
                    done()
                })
            }) 
        })
    })

    describe('handle inputs', () => {
        beforeEach(() => {
            global.console.warn = jest.fn()  
        })

        afterAll(() => {
            vm.now = moment()
        }) 

        it('handles string', (done) => {
            vm.now = '2017-01-01'
            vm.args = ['YYYY-MM-DD']
            vm.$nextTick(() => {
                expect(console.warn).not.toBeCalled()
                expect(vm.$el.textContent).toContain('2017-01-01')                
                done()
            })
        })
        
        it('handles object', (done) => {
            vm.now = {y: 2017, m: 1, d: 1}
            vm.args = ['YYYY-MM-DD']
            vm.$nextTick(() => {
                expect(console.warn).not.toBeCalled()
                expect(vm.$el.textContent).toContain('2017-01-01')                
                done()
            })
        })

        it('handles Date object', (done) => {
            vm.now = new Date(2017, 0, 1);
            vm.args = ['YYYY-MM-DD']
            vm.$nextTick(() => {
                expect(console.warn).not.toBeCalled()
                expect(vm.$el.textContent).toContain('2017-01-01')                
                done()
            })
        })

        it('handles Moment object', (done) => {
            vm.now = moment('2017-01-01')
            vm.args = ['YYYY-MM-DD']
            vm.$nextTick(() => {
                expect(console.warn).not.toBeCalled()
                expect(vm.$el.textContent).toContain('2017-01-01')                
                done()
            })
        })

        it('handles undefined', (done) => {
            vm.now = undefined
            vm.$nextTick(() => {
                expect(console.warn).toBeCalled()
                done()
            })
        })
        
        it('handles invalid string', (done) => {
            vm.now = 'foo'
            vm.$nextTick(() => {
                expect(console.warn).toBeCalled()
                done()
            })
        })
    })
})